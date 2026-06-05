import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

import { createTestApp } from '../testServer';
import { resetDbCache } from '../../../api/_lib/db';
import { MongoMemoryServer } from 'mongodb-memory-server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const featurePath = path.join(__dirname, '../features/history.feature');
const feature = loadFeature(featurePath);

defineFeature(feature, (test) => {
  const app = createTestApp();
  let response: request.Response;

  let mongoServer: MongoMemoryServer | null = null;
  let testDbClient: MongoClient | null = null;

  beforeAll(async () => {
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
  });

  test('Deny access when not authenticated', ({ when, then }) => {
    when(
      /^I make a GET request to the history endpoint "(.*)" without a cookie$/,
      async (route: string) => {
        response = await request(app).get(route);
      },
    );

    then(/^the history response status code should be (\d+)$/, (statusCode: string) => {
      expect(response.status).toBe(parseInt(statusCode, 10));
    });
  });

  test('Successfully fetching history for an authenticated user', ({ given, when, then, and }) => {
    given(/^the user "(.*)" has past reviews in the database$/, async (userId: string) => {
      const client = new MongoClient(process.env.MONGODB_URI as string);
      await client.connect();
      const db = client.db();
      await db.collection('reviews').insertOne({
        userId,
        resumeText: 'Test Resume',
        jobDescription: null,
        result: { overallScore: 85 },
        createdAt: new Date(),
        timeTakenMs: 1200,
      });
      await client.close();
    });

    when(
      /^I make a GET request to the history endpoint "(.*)" with the cookie for "(.*)"$/,
      async (route: string, userId: string) => {
        response = await request(app)
          .get(route)
          .set('Cookie', [`userId=${userId}`]);
      },
    );

    then(/^the history response status code should be (\d+)$/, (statusCode: string) => {
      expect(response.status).toBe(parseInt(statusCode, 10));
    });

    and('the history response body should contain the past reviews', () => {
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].result.overallScore).toBe(85);
    });
  });
});
