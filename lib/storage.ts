
import { BlobSASPermissions, BlobSASSignatureValues, BlobServiceClient, ContainerClient, generateAccountSASQueryParameters, generateBlobSASQueryParameters, StorageSharedKeyCredential } from '@azure/storage-blob';
import azure, { TableService } from 'azure-storage';
import moment from 'moment';
import * as graph from './graph';

export type BlobCorrected = Blob & {
    buffer: Buffer,
}

export enum FileType {
    VIDEO = 'video',
    IMAGE = 'image'
} 

/**
 * Storage entry that points to file location, by < userId, timestamp >.
 * Holds pointer to blob storage.
 */
export interface IEntryStorage {
    PartitionKey: { _: string}, // userid
    RowKey: { _: string}, // timestamp
    BlobName: { _: string},
    FileType: { _: string},
}

/**
 * Storage entry that sorts users by timestamp, by < timestamp, userId >
 */
export interface IUserStorage {
    PartitionKey: { _: string}, // timestamp
    RowKey: { _: string}, // userid
}

export interface IFetchEntriesResponse {
    users: IFetchUserResponse[]
}

export interface IFetchUserResponse {
    id: string,
    displayName: string,
    photoUrl: string,
    entries: { date: string, sasUrl: string }[]
}

function getUserTableName(tenantId: string) {
    const tenant = tenantId.replace(/-/gi, '');
    return `users${tenant}`;
}

function getUploadTableName(tenantId: string) {
    const tenant = tenantId.replace(/-/gi, '');
    return `uploads${tenant}`
}

function getTable(tableName: string): Promise<TableService> {
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const tableSvc = azure.createTableService(AZURE_STORAGE_CONNECTION_STRING);

    return new Promise<TableService>((res, rej) => {
        tableSvc.createTableIfNotExists(tableName, function(error, result, response) {
            if (error) {
                return rej(error);
            }
            return res(tableSvc);
        });
    });
}

async function getEntities<T>(tableName: string, query: azure.TableQuery) {
    const tableSvc = await getTable(tableName);

    return new Promise<T[]>((res, rej) => {
        tableSvc.queryEntities(tableName, query, null, function(error, result, response) {
            if (error) {
                return rej(error);
            }
            return res(result.entries.map(e => e as T));
        });
    });
}

async function deleteEntity(tableName: string, entity: any) {
    const tableSvc = await getTable(tableName);

    return new Promise<void>((res, rej) => {
        tableSvc.deleteEntity(tableName, entity, (error, response) => {
            if (error) {
                return rej(error);
            }
            return res();
        })
    })
}

async function insertEntity(tableName: string, entity: any) {
    const tableSvc = await getTable(tableName);

    return new Promise<void>((res, rej) => {
        tableSvc.insertEntity(tableName, entity, function(error, result, response) {
            if (error) {
                return rej(error);
            }
            return res();
        })
    });
}

async function getBlobSasUri(containerName: string, blobName: string) {
    // It doesn't accept ConnectionString, so we need all the values 🙄
    const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const AZURE_STORAGE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY;

    const containerClient = await getContainer(containerName);
    const sasOptions: BlobSASSignatureValues = {
        containerName: containerName,
        blobName,
        startsOn: new Date(),
        expiresOn: moment().add(1, 'days').toDate(),
        permissions: BlobSASPermissions.parse("r"),
    };

    const sasToken = generateBlobSASQueryParameters(sasOptions, new StorageSharedKeyCredential(AZURE_STORAGE_ACCOUNT_NAME, AZURE_STORAGE_ACCOUNT_KEY)).toString();
    return `${containerClient.getBlockBlobClient(blobName).url}?${sasToken}`;
}

async function getContainer(tenantId: string): Promise<ContainerClient> {
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
    
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

    const containerName = tenantId;
    const containerClient = blobServiceClient.getContainerClient(containerName);

    await containerClient.createIfNotExists();
    return containerClient;
}

async function getProfileImage(token: string, tenantId: string, userId: string): Promise<string> {
    // if image is cached, return sas url.
    const containerName = `users-${tenantId}`;
    const blobName = userId;
    const containerClient = await getContainer(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // todo: should ensure images expire so that updates are reflected.

    try {
        // Apparently this is the best way to tell if the file exists. 🙄
        await blockBlobClient.getProperties();
        return getBlobSasUri(containerName, blobName);
    } catch (err) { }

    const response = await graph.getUserImage(token, userId);
    if (response.error) {
        throw response.error;
    }

    await blockBlobClient.upload(await response.result.arrayBuffer(), response.result.size);

    return getBlobSasUri(containerName, blobName);
}

/**
 * Update relevant tables to reflect the uploaded file.
 * @param userId The userId performing the action
 * @param blobName The name of the uploaded file
 * @param fileType The type of file uploaded (image or video)
 */
export async function updateTablesForBlob(userId: string, tenantId: string, blobName: string, fileType: FileType) {
    // We use two tables. One partitions <UserId, Timestamp, ...> and the other is <Timestamp, User>.
    // We need first to get all videos for a user, and second to know which order to pull users in.
    // TODO - SQL probably does this in a much smarter way...

    var videoEntry = {
        PartitionKey: {'_': userId },
        RowKey: { '_': Date.now().toString() },
        BlobName: { '_': blobName },
        FileType: { '_': fileType },
    };

    var userEntry = {
        PartitionKey: { '_': Date.now().toString() },
        RowKey: {'_': userId },
    };

    await insertEntity(getUploadTableName(tenantId), videoEntry);

    // We only want one copy of the user in the cache table. Fetch all existing, insert the new one, then delete the others.
    // On failure, we could end up with multiple, but we can filter it out and that is better state than there being none.
    const userQuery = new azure.TableQuery().top(50).where('RowKey eq ?', userId);
    const userCache = await getEntities<IUserStorage>(getUserTableName(tenantId), userQuery);
    await insertEntity(getUserTableName(tenantId), userEntry);
    for (let index = 0; index < userCache.length; index++) {
        // todo - Promise.all?
        await deleteEntity(getUserTableName(tenantId), userCache[index]);
    }
}

/**
 * Upload a file to blob storage
 * @param blobName The name of the file
 * @param blob The file
 */
export async function uploadBlob(tenantId: string, blobName: string, blob: BlobCorrected): Promise<void> {
    const containerClient = await getContainer(tenantId);

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.upload(blob.buffer, blob.size);
}

/**
 * Fetch the latest videos for the most recent 30 users in past day.
 */
export async function fetchTableEntries(token: string, tenantId: string): Promise<IFetchEntriesResponse> {
    // Fetch top 30 users
    let timeLimit = moment().subtract(1, 'days').valueOf().toString();
    let query = new azure.TableQuery().top(30).where('PartitionKey ge ?', timeLimit);
    const users = await getEntities<IUserStorage>(getUserTableName(tenantId), query);

    const results: IFetchEntriesResponse = { users: [] };
    for (let index = 0; index < users.length; index++) {
        // todo - Promise.all?
        let u = users[index];
        const user: IFetchUserResponse = { id: u.RowKey._, entries: [], displayName: '', photoUrl: '' };

        // Get user details
        const userResponse = await graph.getUser(token, user.id);
        const imageUrl = await getProfileImage(token, tenantId, user.id);

        user.displayName = userResponse.result.displayName;
        user.photoUrl = imageUrl;

        // Fetch the user's video entries
        query = new azure.TableQuery().top(30).where('PartitionKey eq ? and RowKey ge ?', user.id, timeLimit);
        const entryResults = await getEntities<IEntryStorage>(getUploadTableName(tenantId), query);

        // foreach entry, generate a sas token to blob storage
        for (let j = 0; j < entryResults.length; j++) {
            const entry = entryResults[j];
            const sasUrl = await getBlobSasUri(tenantId, entry.BlobName._);
            user.entries.push({ date: entry.RowKey._, sasUrl });
        }

        results.users.push(user);
    }

    return results;
}