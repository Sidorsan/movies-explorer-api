require('dotenv').config();
const express = require('express');
const { errors } = require('celebrate');
const helmet = require('helmet');

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { allowedCors } = require('./middlewares/cors');
const { limiter } = require('./util/rateLimit');

const { addressMongoServerDevelopmentMode } = require('./config');

const { NODE_ENV, MONGO_URI } = process.env;
app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(requestLogger);
app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    if (method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
      res.header('Access-Control-Allow-Headers', requestHeaders);
      return res.end();
    }
  }
  return next();
});
app.use(router);

app.use(errorLogger);
app.use(errors());

app.use(errorHandler);
mongoose.connect(NODE_ENV === 'production' ? MONGO_URI : addressMongoServerDevelopmentMode, {
  useNewUrlParser: true,
});
app.listen(3000);
