var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    app = express();

// App setup
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use(require('cors')());
app.use(require('./routes/index'));
app.use(require('./routes/auth'));
app.use(require('./routes/user'));
app.use(require('./routes/account'));
app.use(require('./routes/event'));
app.use(require('./routes/wishlist'));
app.use(require('./routes/message'));
app.use(require('./routes/errors'));

module.exports = app;
