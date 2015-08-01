var express = require('express'),
    router = express.Router(),
    Account = require('../lib/models/account'),
    exceptions = require('../lib/exceptions');

router.get('/v1/account', function (request, response, next) {
    response.json({
        account: request.account.toJson()
    });

    next();
});

module.exports = router;
