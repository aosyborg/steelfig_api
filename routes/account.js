var express = require('express'),
    router = express.Router(),
    async = require('async'),
    Account = require('../lib/models/account'),
    User = require('../lib/models/user'),
    Attendees = require('../lib/models/attendees'),
    email = require('../lib/email')
    exceptions = require('../lib/exceptions');

var linkValidation = require('../lib/validation/v1_account_link');

router.get('/v1/account', function (request, response, next) {
    response.json({
        account: request.account.toJson()
    });
});

router.patch('/v1/account', function (request, response, next) {
    var account = request.account;

    account.update(request.body, function (error, account) {
        if (error) {
            console.log(error);
            return next(
                new exceptions.BadEntity(error)
            );
        }

        response.json({
            account: account.toJson()
        });
    });
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
        // Load users from account
        function (callback) {
            user.fromAccountId(newAccountId, callback);
        },

        // Notify users that someone is joining forces with them
        // Note: this is an async operation and will not wait for success
        function (users, result, callback) {
            email.notifyOfAccountLink(request.user.name, users);
            callback(null);
        },

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
        // Unlink account
        function (callback) {
            account.unlink(userId, callback);
        },

        // Load users from old account
        function (accountInfo, callback) {
            user.fromAccountId(request.account.id, callback);
        },

        // Notify users that someone is joining forces with them
        // Note: this is an async operation and will not wait for success
        function (users, result, callback) {
            email.notifyOfAccountUnLink(request.user.name, users);
            callback(null);
        },

        // Load new user profile
        function (callback) {
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
