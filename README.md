# Smart Factory Demo

## Realm App

Contains the Realm application configuration used by the Smart Factory demo. Can be used with the Realm CLI to push/import the configuration to another Realm App.

After importing the application, a secret needs to be created and linked to the fcmServiceAccountConfig value.

The secret should hold the service account credentials used by FCM.

**_Note_** The DB name used in functions is 'SmartFactory'. If your DB name is different, you'll need to update the loginUser and sendAlert functions.

## Client

Contains a simple client that lets you mock sensor data.
