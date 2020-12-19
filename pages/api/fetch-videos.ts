import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Fetch a page of videos.
 * GET /api/fetch-videos[?newer=<Datetime>][?later=<Datetime>]
 * 
 * Query params are optional. They can be used to refresh data (fetch newer) or paginated (fetch older).
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {





    res.statusCode = 200;
    res.json({ data: 'OK'});
}
