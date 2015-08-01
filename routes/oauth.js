var express = require('express'),
    router = express.Router(),
    error_response = require('./errors');

/**
 * Use oauth token to grab account.
 * If an account does not exist, create one.
 */
router.get('/v1/oauth', function (request, response, next) {
    response.json('Not implemented');
});

module.exports = router;
