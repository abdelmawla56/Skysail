const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    console.log('Connecting with Native Driver...');
    await client.connect();
    console.log('Connected successfully with Native Driver');
    await client.db('admin').command({ ping: 1 });
    console.log('Ping successful');
  } catch (err) {
    console.error('NATIVE ERROR:', err);
  } finally {
    await client.close();
  }
}
run();
