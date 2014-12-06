var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

var apiv1 = require('./routes/apiv1');
var error_handler = require('./routes/errors');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(apiv1);
app.use(error_handler);

module.exports = app;
