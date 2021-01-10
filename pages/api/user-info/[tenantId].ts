import type { NextApiRequest, NextApiResponse } from 'next';
import jwt_decode, { JwtPayload } from 'jwt-decode';
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

    let graphToken = clientToken;

    // If we access directly from web, we can use the web token and skip the behalf_of check. Using scp to identify web & teams tokens.
    const decoded = jwt_decode<JwtPayload & { scp: string}>(clientToken);
    const skipServerAuth = decoded.scp !== "access_as_user";

    try {
        if (!skipServerAuth) {
            const token = await graph.getServerSideToken(clientToken, tenantId);
            if (token.error) {
                res.statusCode = 401;
                return res.end();
            }

            graphToken = token.result.access_token;
        }
        
        const response = await fetchUserDetails(graphToken, tenantId);

        res.statusCode = 200;
        res.json(response);
    } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.json({ error: 'Unexpected failure'});
    }
}
