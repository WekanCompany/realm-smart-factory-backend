const Realm = require('realm');
const fs = require('fs');
const BSON = require('bson');

const { sensorDataSchema } = require('./models/SensorData');

const alertLevel = {
  NORMAL: 100,
  WARNING: 400, // Unused. Will use if frequency needs to be lowered.
};

const realmAppId = 'iiot-smart-factory-demo-nphrf';
const realmAppUser = 'sanchanm@wekan.company';
const realmAppPassword = 'PjYGbgFmgSNH2cV6';

const frequency = 30000; // milliseconds

async function run() {
  const image = fs.readFileSync('./images/1643551079.jpg');
  const b64image = image.toString('base64');
  const binImage = Buffer.from(b64image, 'base64');

  const app = new Realm.App({ id: realmAppId });

  const credentials = new Realm.Credentials.emailPassword(
    realmAppUser,
    realmAppPassword
  );

  Realm.App.Sync.setLogger(app, (level, message) => {
    console.log(`Log Level:${level}, Message: ${message}`);
  });

  await app.logIn(credentials);

  setInterval(async () => {
    try {
      const realm = await Realm.open({
        schema: [sensorDataSchema],
        sync: {
          user: app.currentUser,
          partitionValue: 'master',
        },
      });

      const sensorData = {
        _id: new BSON.ObjectID(),
        _partition: 'master',
        id: 'cam',
        code: alertLevel.NORMAL,
        data: binImage,
        acknowledged: false,
        ts: new Date(),
      };

      realm.write(() => {
        realm.create('sensorData', sensorData);
      });

      console.log('Adding sensor data');
      console.log(
        '[',
        new Date(sensorData.ts).toISOString(),
        '] =>',
        'id:',
        sensorData._id.toString(),
        '| Sensor:',
        sensorData.id,
        '| Code:',
        sensorData.code
      );

      const sensorDataList = realm.objects('sensorData');
      console.log(`Sensor data count: ${sensorDataList.length}`);

      realm.close();
    } catch (error) {
      console.log(error);
      process.exit();
    }
  }, frequency);
}

run().catch((err) => {
  console.log(err);
  process.exit();
});

const handle = () => {
  console.log('Exiting...');
  process.exit();
};

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
