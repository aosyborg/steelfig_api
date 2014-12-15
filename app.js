var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    RouteManager = require('./routes/manager'),
    app = express();

// App setup
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
var route_manager = new RouteManager(app);
route_manager
    .register(require('cors')())
    .register(require('./routes/apiv1'))
    .register(require('./routes/errors'));

module.exports = app;
