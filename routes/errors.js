var express = require('express');
var router = express.Router();

module.exports = error_handler;

function error_handler (request, response, error) {
    error = error || {}
    response.status(error.status || 500);
    response.json({ error: {
            status: error.status,
            message: error.message || 'Unknown error'
        }
    });
};
