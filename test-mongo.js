import { MongoClient } from 'mongodb';

async function testConnection() {
  const uri = 'mongodb+srv://kishora2204_db_user:f5a5SCLflaO9IHRm@airesumeanalyzer.lnbdpwb.mongodb.net/?appName=AiResumeAnalyzer';
  console.log('Attempting to connect to MongoDB...');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Successfully connected to MongoDB!');
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await client.close();
  }
}

testConnection();
