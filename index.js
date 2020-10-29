const app = require('express')();
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const bodyparser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const port = 3000;

const notificationOptions = {
    priority: 'high',
    timeToLive: 60 * 60 * 24,
};
const corsOptions = {
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': 'https://email-chat.tuychin.ru',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false,
};
const httpsOptions = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: '12345',
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://my-chat-c4f16.firebaseio.com'
});

// Enables CORS
app.use(cors(corsOptions));

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

https.createServer(httpsOptions, app)
    .listen(port, () => {
        console.log(`[Web push server] Listening port: ${port}`)
    });
