var _ = require('lodash'),
    express = require('express'),
    exceptions = require('../lib/exceptions'),
    router = express.Router();

/**
 * Global error handler.
 * Normalizes the incoming error then builds the response body based on properties present
 */
module.exports = function (error, request, response, next) {
    var body = {};

    // Error is a string
    if (typeof error === 'string') {
        error = new exceptions.SteelfigException({ message: error });
    }
    // Error is an Error object
    if (_.isError(error)) {

        error = new exceptions.SteelfigException({ message: error.message });
    }

    // Unknown error
    if ((error instanceof exceptions.SteelfigException) === false) {
        error = new exceptions.SteelfigException({ message: error });
    }

    body = { message: error.message };

    // Only add errors if present
    if (error.errors) {
        body.errors = errors;
    }

    // Only add validation if present
    if (error.validation) {
        body.validation = error.validation;
    }

    response.status(error.statusCode).json(body);
};
