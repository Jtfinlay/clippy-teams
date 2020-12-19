import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchTableEntries } from '../../lib/storage';

/**
 * Fetch a page of videos.
 * GET /api/fetch-videos[?newer=<Datetime>][?start=<number>]
 * 
 * Query params are optional. They can be used to refresh data (fetch newer) or paginated (fetch by start).
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        // TODO - handle refresh and pagination
        const response = await fetchTableEntries();
        res.statusCode = 200;
        res.json(response);
    } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.json({ error: 'Unexpected failure'});
    }
}
