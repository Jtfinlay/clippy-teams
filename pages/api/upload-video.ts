import type { NextApiRequest, NextApiResponse } from 'next';
import { BlobServiceClient } from '@azure/storage-blob';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import initMiddleware from '../../lib/init-middleware';

const upload = multer();

// for parsing multipart/form-data
const multerAny = initMiddleware(
    upload.any()
);

type NextApiRequestWithFormData = NextApiRequest & {
    files: any[],
}

type BlobCorrected = Blob & {
    buffer: Buffer,
}

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async (req: NextApiRequestWithFormData, res: NextApiResponse) => {
    await multerAny(req, res);

    if (!req.files?.length || req.files.length > 1) {
        res.statusCode = 400;
        res.end();
        return;
    }

    const blob: BlobCorrected = req.files[0];

    try {
        // TODO - should setup post-processing, to assert it is correct video type, aspect ratio, duration, etc.

        const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

        // TODO - Thinking container per organization
        const containerName = 'quickstart';
        const containerClient = blobServiceClient.getContainerClient(containerName);

        const createContainerResponse = await containerClient.createIfNotExists();

        // Create a unique name for the blob
        const blobName = `${uuidv4()}.webm`;

        // Get a block blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        const uploadBlobResponse = await blockBlobClient.upload(blob.buffer, blob.size);

        res.statusCode = 201;
        res.end();
    } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.json({ error: 'Unexpected failure'});
    }
}
