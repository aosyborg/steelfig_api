var express = require('express'),
    router = express.Router(),
    async = require('async'),
    exceptions = require('../lib/exceptions');

router.get('/v1/user', function (request, response, next) {
    response.json({
        user: request.user.toJson(),
        account: request.account.toJson()
    });

    next();
});

module.exports = router;
