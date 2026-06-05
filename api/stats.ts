import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './_lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  try {
    const db = await getDb();
    const statsCol = db.collection('stats');
    const stats = await statsCol.findOne({ id: 'global' });

    if (!stats) {
      return res.status(200).json({
        totalReviews: 0,
        avgTimeMs: 8000,
        totalRewrites: 0,
      });
    }

    const totalReviews = stats.totalReviews || 0;
    const totalTimeMs = stats.totalTimeMs || 0;
    const avgTimeMs = totalReviews > 0 ? totalTimeMs / totalReviews : 8000;
    const totalRewrites = stats.totalRewrites || 0;

    return res.status(200).json({
      totalReviews,
      avgTimeMs,
      totalRewrites,
    });
  } catch (err) {
    console.error('Stats API error:', err);
    // Return graceful fallback if DB is not set up
    return res.status(200).json({
      totalReviews: 0,
      avgTimeMs: 8000,
      totalRewrites: 0,
    });
  }
}
