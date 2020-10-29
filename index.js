const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const app = express();
const port = 3000;
const notificationOptions = {
    priority: 'high',
    timeToLive: 60 * 60 * 24
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://my-chat-c4f16.firebaseio.com'
});

// Enables CORS
app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': 'https://email-chat.tuychin.ru',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));

app.use(bodyparser.json());

app.post('/firebase/notification', (req, res) => {
    const registrationToken = req.body.registrationToken;
    const message = req.body.message;
    const options =  notificationOptions;
    
    admin.messaging().sendToDevice(registrationToken, message, options)
        .then(response => {
            res.status(200).send('[Web push server] Notification sent successfully')
        })
        .catch(error => {
            console.log(error);
        });

});

app.listen(port, () => {
    console.log(`[Web push server] Listening port: ${port}`)
});