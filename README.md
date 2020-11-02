# push-notification-server
Push notification server on Node js and Firebase admin SDK

### Installation

1. Clone project

`git clone https://github.com/tuychin/push-notification-server.git`

2. Redirect from 80 port to 8080

`sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080`

3. Redirect from 443 port to 8443

`sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 8443`

4. Add your **serviceAccountKey.json** to project base path

5. Change **corsOptions.origin** (add your domain) in **index.js**

6. Add your ssl **privatekey.pem** and **sertificate.pem** to project base path

7. Install dependencies
`npm i`

8. Run server
`npm start`

### Usage

#### Send notification

API (POST):
`https://your-domain.com/api/notification`

Body example:
```javascript
{
    "message": {
        "notification": {
            "title": "Firebase",
            "body": "Firebase is awesome",
            "click_action": "https://your-site.com/path",
            "icon": "/assets/icon-512x512.png"
        }
    },
    "userId": "UsErId"
}
```

#### Run server on background (pm2)

Install: `npm install pm2 -g`

Start server: `pm2 --name push-notification-server start npm -- start`

Managing server:
```
pm2 restart 0
pm2 delete 0
pm2 logs
pm2 list
```

More about pm2: https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/
