import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.warn('Please add your Mongo URI to .env.local');
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

export async function getDb() {
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set.');
  }
  if (!clientPromise) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  await clientPromise;
  if (!client) throw new Error('MongoClient is null after connect');
  return client.db();
}
