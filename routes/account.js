var express = require('express'),
    router = express.Router(),
    async = require('async'),
    Account = require('../lib/models/account'),
    User = require('../lib/models/user'),
    Attendees = require('../lib/models/attendees'),
    exceptions = require('../lib/exceptions');

var linkValidation = require('../lib/validation/v1_account_link');

router.get('/v1/account', function (request, response, next) {
    response.json({
        account: request.account.toJson()
    });

    next();
});

router.post('/v1/account/link', linkValidation, function (request, response, next) {
    var user = new User(),
        account = new Account(),
        attendees = new Attendees(),
        eventId = request.body.eventId,
        orgAccountId = request.account.id,
        newAccountId = request.body.accountId;

    if (!request.form.isValid) {
        return next(
            new exceptions.BadEntity({validation: request.form.errors })
        );
    }

    async.waterfall([
        // Link account
        function (callback) {
            account.link(eventId, orgAccountId, newAccountId, callback);
        },

        // Load new user profile
        function (accountInfo, callback) {
            user.fromId(request.user.id, callback);
        },

        // Load new account
        function (user, callback) {
            request.user = user;
            account.fromUser(user, callback);
        },

        // Load new attendees
        function (account, callback) {
            request.account = account;
            attendees.fromEvent(eventId, callback);
        }

    ], function (error, attendees) {
        if (error) {
            console.log(error);
            return next(error);
        }

        response.json({
            user: request.user,
            account: request.account,
            attendees: attendees.toJson()
        });
    });
});

router.patch('/v1/account/link', function (request, response, next) {
    var account = new Account(),
        user = new User(),
        attendees = new Attendees(),
        eventId = request.body.eventId,
        userId = request.user.id;

    async.waterfall([
        // Link account
        function (callback) {
            account.unlink(userId, callback);
        },

        // Load new user profile
        function (accountInfo, callback) {
            user.fromId(request.user.id, callback);
        },

        // Load new account
        function (user, callback) {
            request.user = user;
            account.fromUser(user, callback);
        },

        // Load new attendees
        function (account, callback) {
            request.account = account;
            attendees.fromEvent(eventId, callback);
        }

    ], function (error, attendees) {
        if (error) {
            console.log(error);
            return next(error);
        }

        response.json({
            user: request.user,
            account: request.account,
            attendees: attendees.toJson()
        });
    });
});

module.exports = router;
