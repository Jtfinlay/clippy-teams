import type { NextApiRequest, NextApiResponse } from 'next';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import initMiddleware from '../../../lib/init-middleware';
import { updateTablesForBlob, uploadBlob } from '../../../lib/storage';
import * as graph from '../../../lib/graph';
import { BlobCorrected, FileType } from '../../../lib/schema';

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
 * Upload an image to blob storage.
 * 
 * POST /api/upload-image
 * Expects multipart/form-data input with a single file in image format.
 */
export default async (req: NextApiRequestWithFormData, res: NextApiResponse) => {
    await multerAny(req, res);

    const clientToken = req.headers.authorization;
    const { query: { tenantId } } = req;

    if (!req.files?.length || req.files.length > 1) {
        res.statusCode = 400;
        res.end();
        return;
    }

    if (!clientToken || !tenantId || Array.isArray(tenantId)) {
        res.statusCode = 400;
        return res.end();
    }

    let graphToken = clientToken;

    // If we access directly from web, we can use the web token and skip the behalf_of check. Using scp to identify web & teams tokens.
    const decoded = jwt_decode<JwtPayload & { scp: string}>(clientToken);
    const skipServerAuth = decoded.scp !== "access_as_user";

    const blob: BlobCorrected = req.files[0];

    try {
        // TODO - should setup post-processing, to assert it is correct image type, aspect ratio, etc.
        // Right now we just accept what is passed in, which could lead to storage/security/integrity issues.
        // Note that Multer limits to 1MB file size by default

        if (!skipServerAuth) {
            const token = await graph.getServerSideToken(clientToken, tenantId);
            if (token.error) {
                res.statusCode = 401;
                return res.end();
            }

            graphToken = token.result.access_token;
        }

        const caller = await graph.getCaller(graphToken);

        // Create a unique name for the blob
        const blobName = `${uuidv4()}.png`;

        await uploadBlob(tenantId, blobName, blob);
        await updateTablesForBlob(caller.result.id, tenantId, blobName, FileType.IMAGE);

        res.statusCode = 201;
        res.end();
    } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.json({ error: 'Unexpected failure'});
    }
}
