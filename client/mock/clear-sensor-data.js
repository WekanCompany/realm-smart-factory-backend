const mongodb = require('mongodb');

const uri = '';

const client = new mongodb.MongoClient(uri);

async function run() {
  try {
    await client.connect();

    const database = client.db('SmartFactory');
    const sensorData = database.collection('sensorData');

    await sensorData.deleteMany({});
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
