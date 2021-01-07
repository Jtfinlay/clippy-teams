import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchTableEntries } from '../../../lib/storage';
import * as graph from '../../../lib/graph';

/**
 * Fetch a page of clippies.
 * GET /api/fetch-content/{tenantId}[?newer=<Datetime>][?start=<number>]
 * 
 * Tenant Id required.
 * Other query params are optional. They can be used to refresh data (fetch newer) or paginated (fetch by start).
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {

    const clientToken = req.headers.authorization;
    const { query: { tenantId } } = req;

    if (!clientToken || !tenantId || Array.isArray(tenantId)) {
        res.statusCode = 400;
        return res.end();
    }

    try {
        // TODO - handle refresh and pagination

        const token = await graph.getServerSideToken(clientToken, tenantId);
        if (token.error) {
            res.statusCode = 401;
            return res.end();
        }
        
        const response = await fetchTableEntries(token.result.access_token, tenantId);

        res.statusCode = 200;
        res.json(response);
    } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.json({ error: 'Unexpected failure'});
    }
}
