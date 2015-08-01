var express = require('express'),
    router = express.Router(),
    async = require('async'),
    exceptions = require('../lib/exceptions'),
    User = require('../lib/models/user'),
    Account = require('../lib/models/account');

router.get('/', function (request, response, next) {
    response.json({
        version: '1.0',
        author: 'Dave Symons',
        routes: [
            '/v1/auth',
            '/v1/user',
            '/v1/account'
        ]
    });

    next();
});

/**
 * Inject user & account into request from token
 */
router.use('/v1/*', function (request, response, next) {
    var token = request.headers.authorization || false;

    async.waterfall([
        // Load user
        function (callback) {
            var user = new User();
            user.fromToken(token, function (user) {
                if (!user) {
                    callback(new exceptions.Unauthorized());
                }

                request.user = user;
                callback(null, user);
            });
        },

        // Load account
        function (user, callback) {
            var account = new Account();
            account.fromUser(user, function (account) {
                if (!account) {
                    callback(new exceptions.Unauthorized());
                }

                request.account = account;
                callback(null);
            });
        }
    ], function (error, result) {
        if (error) {
            return next(error);
        }
        next('route');
    });
});

module.exports = router;
