var express = require('express'),
    router = express.Router(),
    Account = require('../lib/models/account'),
    User = require('../lib/models/user'),
    exceptions = require('../lib/exceptions');

router.get('/v1/account', function (request, response, next) {
    response.json({
        account: request.account.toJson()
    });

    next();
});

router.post('/v1/account/unlink', function (request, response, next) {
    eventId = request.body.eventId;
    userId = request.user.id;
    account = new Account();

    account.unlink(eventId, userId, function (error) {
        if (error) {
            return next(error);
        }

        var user = new User();
        user.fromId(userId, function (error, user) {
            request.user = user;
            response.json(user.toJson());
        });
    });
});

module.exports = router;
