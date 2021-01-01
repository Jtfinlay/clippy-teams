import type { NextApiRequest, NextApiResponse } from 'next';
import * as graph from '../../lib/graph';

/**
 * Fetch a page of videos.
 * POST /api/exchange-token
 * 
 * Body: {
 *  "tenantId": string
 * }
 * 
 * Query params are optional. They can be used to refresh data (fetch newer) or paginated (fetch by start).
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {

    const clientToken = req.headers.authorization;
    const tenantId = req.body['tenantId'];

    if (!clientToken || !tenantId) {
        res.statusCode = 400;
        return res.end();
    }

    try {
        const response = await graph.getServerSideToken(clientToken, tenantId);
        res.statusCode = response.statusCode;
        res.json(response.error);
    } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.json({ error: 'Unexpected failure'});
    }
}
