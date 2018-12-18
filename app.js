import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import rfs from 'rotating-file-stream';
import jwt from 'express-jwt';
import winston from './src/config/winston';

import databaseMiddleware from './src/middleware/database';
import errorMiddleware from './src/middleware/error';

import router from './src/routes/index';

const app = express();
const public_key = fs.readFileSync(path.join(__dirname, 'public.key'));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400 },
  stream: winston.stream
}));

app.use(morgan('combined', {
  stream: rfs('access.log', {
    interval: '1d',
    path: path.join(__dirname, 'logs', 'access')
  })
}));

app.use(databaseMiddleware);

app.use(jwt({
  secret: public_key,
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
    '/usuario/autenticar',
    '/usuario'
  ]
}));

app.use(errorMiddleware);

app.use('/', router);

app.use(function (req, res) {
  res.status(404).json({error: true, code: 404, message: 'Page not found!'});
});

app.listen(process.env.APP_PORT || 3000, () => {
  console.log(`Listening to port ${process.env.APP_PORT || 3000}`);
});