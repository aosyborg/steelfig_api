var express = require('express'),
    router = express.Router(),
    error_response = require('./errors'),
    async = require('async'),
    exceptions = require('../lib/exceptions'),
    oauthProviders = require('../lib/oauthProviders'),
    User = require('../lib/models/user'),
    Account = require('../lib/models/account');

/**
 * Use oauth token to grab account.
 * If an account does not exist, create one.
 */
router.post('/v1/auth', function (request, response, next) {
    oauthProviders.googleUser(request.body.access_token, function (error, userData) {
        if (error) {
            return next(error);
        }

        var user = new User();
        user.fromEmail(userData.email, function (error, user) {
            if (error) {
                return next(new exceptions.Unauthorized({message: error}));
            }

            // Update user info incase anything changed
            user.avatar = userData.avatar;
            user.name = userData.name;
            user.save(function (error, updatedUser) {
                response.json({'user': updatedUser.toJson()});
            });

        });
    });
});

/**
 * Inject user & account into request from token
 */
router.use('/v1/*', function (request, response, next) {
    var token = request.headers.authorization || false;
    token = token.replace(/Basic (.*)/i, '$1');

    async.waterfall([
        // Load user
        function (callback) {
            var user = new User();
            user.fromToken(token, function (error, user) {
                if (error) {
                    callback(new exceptions.Unauthorized());
                }

                request.user = user;
                callback(null, user);
            });
        },

        // Load account
        function (user, callback) {
            var account = new Account();
            account.fromUser(user, function (error, account) {
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
