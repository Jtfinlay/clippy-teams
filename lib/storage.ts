
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import azure, { TableService } from 'azure-storage';

export type BlobCorrected = Blob & {
    buffer: Buffer,
}

export enum FileType {
    VIDEO = 'video',
    IMAGE = 'image'
} 

export function getTable(tableName: string): Promise<TableService> {
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

async function getEntitiesByRowKey(tableName: string, rowKey: string) {
    const tableSvc = await getTable(tableName);
    const query = new azure.TableQuery().top(50).where('RowKey eq ?', rowKey);

    return new Promise<any[]>((res, rej) => {
        tableSvc.queryEntities(tableName, query, null, function(error, result, response) {
            if (error) {
                return rej(error);
            }
            return res(result.entries);
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

export async function addTableEntry(userId: string, blobName: string, fileType: FileType) {
    // We use two tables. One partitions <UserId, Timestamp> and the other is <Timestamp, User>.
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

    await insertEntity('globalvideos', videoEntry);

    // We only want one copy of the user in the cache table. Fetch all existing, insert the new one, then delete the others.
    // On failure, we could end up with multiple, but we can filter it out and that is better state than there being none.
    const userCache = await getEntitiesByRowKey('globalusercache', userId);
    await insertEntity('globalusercache', userEntry);
    userCache.forEach(async u => await deleteEntity('globalusercache', u));
}

export async function getContainer(): Promise<ContainerClient> {
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

    // TODO - should setup container per organization
    const containerName = 'global';
    const containerClient = blobServiceClient.getContainerClient(containerName);

    await containerClient.createIfNotExists();
    return containerClient;
}

export async function uploadBlob(blobName: string, blob: BlobCorrected): Promise<void> {
    const containerClient = await getContainer();

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.upload(blob.buffer, blob.size);
}

export async function fetchTableEntries() {

    // const query = new azure.TableQuery()
    //     .top(30)
    //     .

    const tableSvc = await getTable();
}