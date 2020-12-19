
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import azure, { TableService } from 'azure-storage';

export type BlobCorrected = Blob & {
    buffer: Buffer,
}

export enum FileType {
    VIDEO = 'video',
    IMAGE = 'image'
} 

export function getTable(): Promise<TableService> {
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const tableSvc = azure.createTableService(AZURE_STORAGE_CONNECTION_STRING);

    const tableName = 'global';

    return new Promise<TableService>((res, rej) => {
        tableSvc.createTableIfNotExists(tableName, function(error, result, response) {
            if (error) {
                return rej(error);
            }
            return res(tableSvc);
        });
    });
}

export async function addTableEntry(userId: string, blobName: string, fileType: FileType) {
    const tableSvc = await getTable();

    var entry = {
        PartitionKey: {'_': userId },
        RowKey: { '_': Date.now().toString() },
        BlobName: { '_': blobName },
        FileType: { '_': fileType },
    };

    return new Promise<void>((res, rej) => {
        tableSvc.insertEntity('global', entry, function(error, result, response) {
            if (error) {
                return rej(error);
            }
            return res();
        })
    });
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