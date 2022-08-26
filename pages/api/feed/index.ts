import { NextApiRequest, NextApiResponse } from 'next';
import getFeed from './getFeed';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await getFeed('google');
  res.json(result);
}
