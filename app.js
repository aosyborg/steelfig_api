var express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    app = express();

// App setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use(cors());
app.use(require('./routes/apiv1'));
app.use(require('./routes/errors'));

module.exports = app;
