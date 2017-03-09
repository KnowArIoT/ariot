const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const index = require('./routes/index');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', index);

app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  .json({
    status: 'error',
    code: err.code,
    message: err.message
  });
});

module.exports = app;
