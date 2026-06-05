import express, { Express } from 'express';
import reviewHandler from '../../api/review.js';
import historyHandler from '../../api/history.js';
import statsHandler from '../../api/stats.js';

export function createTestApp(): Express {
  const app = express();

  // Vercel functions use req.body directly, so we need to parse JSON
  app.use(express.json());

  // Wrap Vercel handlers for Express
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wrap = (handler: any) => async (req: express.Request, res: express.Response) => {
    // Vercel functions expect query and cookies on the req object
    if (!req.query) req.query = {};
    if (!req.cookies) {
      req.cookies = {};
      const cookieHeader = req.headers.cookie;
      if (cookieHeader) {
        cookieHeader.split(';').forEach((c) => {
          const [key, value] = c.split('=');
          req.cookies[key.trim()] = decodeURIComponent(value);
        });
      }
    }

    // We add status and json methods to res to mock VercelResponse
    // Express already has status() and json() which Vercel uses.
    try {
      await handler(req, res);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  app.post('/api/review', wrap(reviewHandler));
  app.get('/api/history', wrap(historyHandler));
  app.get('/api/stats', wrap(statsHandler));

  return app;
}
