import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchUserDetails } from '../../../lib/storage';
import * as graph from '../../../lib/graph';

/**
 * Fetch this user's info
 * GET /api/user-info/{tenantId}
 * 
 * Tenant Id required.
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {

    const clientToken = req.headers.authorization;
    const { query: { tenantId } } = req;

    if (!clientToken || !tenantId || Array.isArray(tenantId)) {
        res.statusCode = 400;
        return res.end();
    }

    try {
        const token = await graph.getServerSideToken(clientToken, tenantId);
        if (token.error) {
            res.statusCode = 401;
            return res.end();
        }
        
        const response = await fetchUserDetails(token.result.access_token, tenantId);

        res.statusCode = 200;
        res.json(response);
    } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.json({ error: 'Unexpected failure'});
    }
}
