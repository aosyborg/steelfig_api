var express = require('express');
var router = express.Router();

var error_handler = function(request, response, error) {
    error = error || {}
    response.status(error.status || 500);
    response.json({ error: {
            status: error.status,
            message: error.message || 'Unknown error'
        }
    });
};

module.exports = error_handler;
