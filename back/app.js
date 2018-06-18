const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const https = require('https');
const fs = require('fs');

const routes = require('./routes/routes');
const config = require('./config/config');

const app = express();

const options = {
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
};
mongoose.Promise = global.Promise;
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/student', options)
    .catch(error => console.warn(error));
  mongoose.connection
    .on('error', error => console.warn('Warning', error.message));
}
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
routes(app);
app.use((req, res, err) => {
  res.status(422).send({ error: err.message });
});

app.use((req, res) => {
  res.status(404).send({
    message: 'Page Not Found',
    status: 404,
  });
});

let server;

let httpsOptions = null;
// let server;
if (process.env.NODE_ENV === 'dev') {
  server = http.createServer(app);
} else {
  httpsOptions = {
    key: fs.readFileSync(config.key_url),
    cert: fs.readFileSync(config.cert_url),
  };
  server = https.createServer(httpsOptions, app);
}

module.exports = server;
