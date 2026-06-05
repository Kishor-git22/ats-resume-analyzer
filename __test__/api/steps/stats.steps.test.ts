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

const featurePath = path.join(__dirname, '../features/stats.feature');
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

  test('Successfully fetching stats when the database is empty', ({ given, when, then, and }) => {
    given('the stats collection is empty', async () => {
      if (testDbClient) {
        const db = testDbClient.db();
        const collections = await db.collections();
        for (const collection of collections) {
          await collection.deleteMany({});
        }
      }
    });

    when(/^I make a GET request to the stats endpoint "(.*)"$/, async (route: string) => {
      response = await request(app).get(route);
    });

    then(/^the stats response status code should be (\d+)$/, (statusCode: string) => {
      expect(response.status).toBe(parseInt(statusCode, 10));
    });

    and(/^the response body should have totalReviews (\d+)$/, (totalReviews: string) => {
      expect(response.body.totalReviews).toBe(parseInt(totalReviews, 10));
    });
  });

  test('Successfully fetching stats when the database is populated', ({
    given,
    when,
    then,
    and,
  }) => {
    given('the stats collection has some existing data', async () => {
      const client = new MongoClient(process.env.MONGODB_URI as string);
      await client.connect();
      const db = client.db();
      await db.collection('stats').insertOne({
        id: 'global',
        totalReviews: 10,
        totalTimeMs: 15000,
        totalRewrites: 25,
      });
      await client.close();
    });

    when(/^I make a GET request to the stats endpoint "(.*)"$/, async (route: string) => {
      response = await request(app).get(route);
    });

    then(/^the stats response status code should be (\d+)$/, (statusCode: string) => {
      expect(response.status).toBe(parseInt(statusCode, 10));
    });

    and('the response body should reflect the existing data', () => {
      expect(response.body.totalReviews).toBe(10);
      expect(response.body.avgTimeMs).toBe(1500);
      expect(response.body.totalRewrites).toBe(25);
    });
  });
});
