import type { NextApiRequest, NextApiResponse } from 'next';
import jwt_decode, { JwtPayload } from 'jwt-decode';
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

    let graphToken = clientToken;

    // If we access directly from web, we can use the web token and skip the behalf_of check. Using scp to identify web & teams tokens.
    const decoded = jwt_decode<JwtPayload & { scp: string}>(clientToken);
    const skipServerAuth = decoded.scp !== "access_as_user";

    try {
        // TODO - handle refresh and pagination

        if (!skipServerAuth) {
            const token = await graph.getServerSideToken(clientToken, tenantId);
            if (token.error) {
                res.statusCode = 401;
                return res.end();
            }

            graphToken = token.result.access_token;
        }

        const response = await fetchTableEntries(graphToken, tenantId);

        res.statusCode = 200;
        res.json(response);
    } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.json({ error: 'Unexpected failure'});
    }
}
