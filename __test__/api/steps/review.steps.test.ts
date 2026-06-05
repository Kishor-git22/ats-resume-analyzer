import { loadFeature, defineFeature } from 'jest-cucumber';
import { jest } from '@jest/globals';
import request from 'supertest';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { createTestApp } from '../testServer';
import { resetDbCache } from '../../../api/_lib/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const featurePath = path.join(__dirname, '../features/review.feature');
const feature = loadFeature(featurePath);

const mockGeminiResponse = {
  overallScore: 95,
  categoryScores: { clarity: 90, impact: 100, atsCompatibility: 90, structure: 100 },
  summary: 'Excellent resume',
  strengths: ['Great'],
  weaknesses: ['None'],
  rewrites: [
    { original: 'Did stuff', suggested: 'Did great stuff', reason: 'Better' },
    { original: 'Did stuff 2', suggested: 'Did great stuff 2', reason: 'Better' },
    { original: 'Did stuff 3', suggested: 'Did great stuff 3', reason: 'Better' },
  ],
  missingSections: [],
};

defineFeature(feature, (test) => {
  const app = createTestApp();
  let response: request.Response;
  let originalFetch: typeof globalThis.fetch;

  let mongoServer: MongoMemoryServer | null = null;
  let testDbClient: MongoClient | null = null;

  beforeAll(async () => {
    process.env.GEMINI_API_KEY = 'mock_key'; // required by handler
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;
    testDbClient = new MongoClient(uri);
    await testDbClient.connect();
  });

  afterAll(async () => {
    await resetDbCache();
    if (testDbClient) {
      await testDbClient.close();
      testDbClient = null;
    }
    if (mongoServer) {
      await mongoServer.stop();
      mongoServer = null;
    }
  });

  beforeEach(async () => {
    if (testDbClient) {
      const db = testDbClient.db();
      const collections = await db.collections();
      for (const collection of collections) {
        await collection.deleteMany({});
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response = null as any;

    originalFetch = globalThis.fetch;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalThis.fetch = jest.fn(async (url: any, options: any) => {
      if (url.toString().includes('generativelanguage.googleapis.com')) {
        return new Response(
          JSON.stringify({
            candidates: [
              {
                content: { parts: [{ text: JSON.stringify(mockGeminiResponse) }] },
              },
            ],
          }),
        );
      }
      return originalFetch(url, options);
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('Deny request without resume text', ({ when, then, and }) => {
    when(
      /^I make a POST request to the review endpoint "(.*)" with an empty body$/,
      async (route: string) => {
        response = await request(app).post(route).send({});
      },
    );

    then(/^the review response status code should be (\d+)$/, (statusCode: string) => {
      expect(response.status).toBe(parseInt(statusCode, 10));
    });

    and('the review response body should contain an error about missing text', () => {
      expect(response.body.error).toBe('Field `resumeText` (string) is required.');
    });
  });

  test('Successfully review a resume', ({ when, then, and }) => {
    when(
      /^I make a POST request to the review endpoint "(.*)" with a valid resume text$/,
      async (route: string) => {
        const resumeText = 'A'.repeat(150);
        response = await request(app)
          .post(route)
          .set('Cookie', ['userId=test-user-id'])
          .send({ resumeText });
      },
    );

    then(/^the review response status code should be (\d+)$/, (statusCode: string) => {
      expect(response.status).toBe(parseInt(statusCode, 10));
    });

    and('the review response body should contain the overall score', () => {
      expect(response.body.overallScore).toBe(95);
    });

    and('the database should have saved the review record', async () => {
      const client = new MongoClient(process.env.MONGODB_URI as string);
      await client.connect();
      const db = client.db();
      const reviews = await db.collection('reviews').find({ userId: 'test-user-id' }).toArray();
      await client.close();

      expect(reviews.length).toBe(1);
      expect(reviews[0].result.overallScore).toBe(95);
    });
  });
});
