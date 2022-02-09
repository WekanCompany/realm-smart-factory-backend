exports = async function (arg) {
  const firebase = require('firebase-admin');

  const users = await context.services
    .get('mongodb-atlas')
    .db('SmartFactory')
    .collection('users')
    .find({}, { _id: 0, token: 1 })
    .toArray();

  const fcmServiceAccountConfig = context.values.get('fcmServiceAccountConfig');

  firebase.initializeApp({
    credential: firebase.credential.cert(EJSON.parse(fcmServiceAccountConfig)),
  });

  const registrationTokens = [
    ...new Set(
      users.map(function (item) {
        return item['token'];
      })
    ),
  ];

  const message = {
    notification: {
      title: 'Movement alert',
      body: 'Movement has been detected on the factory floor',
    },
    tokens: registrationTokens,
  };

  const response = await firebase.messaging().sendMulticast(message);

  console.log(EJSON.stringify(response));

  return { arg: arg };
};
