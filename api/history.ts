import type { VercelRequest, VercelResponse } from '@vercel/node';
import { parse } from 'cookie';
import { getDb } from './lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  const cookies = parse(req.headers.cookie || '');
  const userId = cookies.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: No cookie found.' });
  }

  try {
    const db = await getDb();
    const reviewsCol = db.collection('reviews');
    const reviews = await reviewsCol
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return res.status(200).json(reviews);
  } catch (err) {
    console.error('History API error:', err);
    return res.status(500).json({ error: 'Internal server error fetching history.' });
  }
}
