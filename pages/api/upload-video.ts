import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import initMiddleware from '../../lib/init-middleware';
import { updateTablesForBlob, BlobCorrected, FileType, uploadBlob } from '../../lib/storage';

const upload = multer();

// for parsing multipart/form-data
const multerAny = initMiddleware(
    upload.any()
);

type NextApiRequestWithFormData = NextApiRequest & {
    files: any[],
}

export const config = {
    api: {
        bodyParser: false,
    }
}

/**
 * Upload a video to blob storage.
 * 
 * POST /api/upload-video
 * Expects multipart/form-data input with a single file in webm format.
 */
export default async (req: NextApiRequestWithFormData, res: NextApiResponse) => {
    await multerAny(req, res);

    if (!req.files?.length || req.files.length > 1) {
        res.statusCode = 400;
        res.end();
        return;
    }

    // TODO - Authentication

    const blob: BlobCorrected = req.files[0];

    try {
        // TODO - should setup post-processing, to assert it is correct video type, aspect ratio, duration, etc.
        // Right now we just accept what is passed in, which could lead to storage/security/integrity issues.
        // Note that Multer limits to 1MB file size by default

        // Create a unique name for the blob
        const blobName = `${uuidv4()}.webm`;

        await uploadBlob(blobName, blob);
        await updateTablesForBlob("admin", blobName, FileType.VIDEO);

        res.statusCode = 201;
        res.end();
    } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.json({ error: 'Unexpected failure'});
    }
}
