const app = require('express')();
const http = require('http');
const https = require('https');
const redirector = require('redirect-https');
const fs = require('fs');
const cors = require('cors');
const bodyparser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const insecurePort = 8080;
const securePort = 8443;

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
    key: fs.readFileSync('./ssl/privatekey.pem'),
    cert: fs.readFileSync('./ssl/sertificate.pem'),
};

const httpServer = http.createServer();
const httpsServer = https.createServer(httpsOptions, app);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://my-chat-c4f16.firebaseio.com'
});

// Redirect to https
httpServer.on('request', redirector());

// Enables CORS
app.use(cors(corsOptions));

app.use(bodyparser.json());

app.get('/', (req, res) => {
    res.header('Content-type', 'text/html');
    return res.end('<h1>This is server for push notifications. Use POST for /api/notification</h1>');
});

app.get('/api/notification', (req, res) => {
    res.header('Content-type', 'text/html');
    return res.end('<h1>This is server for push notifications. Use POST for /api/notification</h1>');
});

app.post('/api/notification', async (req, res) => {
    const userId = req.body.userId;
    const message = req.body.message;
    const options =  notificationOptions;
    console.log(userId);

    const db = admin.database();
    const userTokenRef = db.ref(`users/${userId}/messagingToken`);

    userTokenRef.once('value', (snapshot) => {
        const userToken = snapshot.val();

        admin.messaging().sendToDevice(userToken, message, options)
            .then(response => {
                res.status(200).send(response)
            })
            .catch(error => {
                console.log(error);
            });
    });
});

httpServer.listen(insecurePort, () => {
    console.log(`[Web push server] Listening insecure port: ${insecurePort}`);
});

httpsServer.listen(securePort, () => {
    console.log(`[Web push server] Listening secure port: ${securePort}`);
});
