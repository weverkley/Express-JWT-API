import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';

import databaseMiddleware from './src/middleware/database';
import errorMiddleware from './src/middleware/error';

import router from './src/routes/index';

const app = express();

app.use(cors());
app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "OPTIONS,GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(databaseMiddleware);

app.use(jwt({
  secret: process.env.SECRET,
  credentialsRequired: true,
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1].replace(/^"|"$/g, ''); // workaround: remove quotes from token
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
}).unless({
  path: [
    // public routes that don't require authentication
    '/user/auth',
  ]
}));

app.use('/', router);

app.use(errorMiddleware);

var log = fs.createWriteStream(path.join(__dirname, 'logs', 'server.log'), { flags: 'a' });

app.listen(process.env.APP_PORT || 3000, () => {
  console.log(`Listening to port ${process.env.APP_PORT || 3000}`);
  log.write(`Server started: ${new Date()}` + '\r\n');
}).on('error', (e) => {
  e.date = new Date();
  console.log(e);
  log.write(JSON.stringify(e) + '\r\n');
});