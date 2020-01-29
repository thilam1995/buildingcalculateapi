const admin = require('firebase-admin');
//const serviceAccount = require('./serviceaccount/buildingschedulebackup-firebase-adminsdk-tr3vt-a54b70c6a9.json');
const serviceAccount = require('../serviceaccount/buidlingschedule-firebase-adminsdk-r6sso-dcad8f49a9.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://buildingschedulebackup.firebaseio.com"
});

const database = admin.firestore();

module.exports = database;