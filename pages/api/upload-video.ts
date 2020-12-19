import type { NextApiRequest, NextApiResponse } from 'next';
import { BlobServiceClient } from '@azure/storage-blob';
import multer from 'multer';

const upload = multer();

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }

            return resolve(result);
        })
    })
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // for parsing multipart/form-data
    await runMiddleware(req, res, upload.array());

    if (!req.body) {
        console.error('Bad Request');
        res.statusCode = 400;
        res.json({});
        return;
    }

    console.log("BODY: ");
    console.log(req.files);

    const blob: Blob = req.body;

    try {
        const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        
        const containerName = 'quickstart';
        const containerClient = blobServiceClient.getContainerClient(containerName);

        const createContainerResponse = await containerClient.createIfNotExists();

        // Create a unique name for the blob
        const blobName = 'video.webm';

        // Get a block blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        const uploadBlobResponse = await blockBlobClient.upload(blob);
        
        res.statusCode = 200;
    } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.json({ error: 'Unexpected failure'});
    }
}
