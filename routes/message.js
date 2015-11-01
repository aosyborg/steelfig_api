var express = require('express'),
    router = express.Router(),
    async = require('async'),
    email = require('../lib/email'),
    exceptions = require('../lib/exceptions'),
    Message = require('../lib/models/message');

var messageValidation = require('../lib/validation/v1_message');
var replyValidation = require('../lib/validation/v1_message_reply');

router.get('/v1/messages', function (request, response, next) {
    var messageModel = new Message(),
        accountId = request.user.accountId,
        eventId = request.query.eventId;

    messageModel.fetchAll(accountId, eventId, function (error, messages) {
        if (error) {
            console.log(error);
            return next(
                new exceptions.NotFound(error)
            );
        }

        response.json(messages);
    });
});

router.post('/v1/message', messageValidation, function (request, response, next) {
    var message = new Message(),
        data = request.body || {};

    if (!request.form.isValid) {
        return next(
            new exceptions.BadEntity({validation: request.form.errors })
        );
    }

    data.fromId = request.account.id;
    message.create(data, function (error, messages) {
        if (error) {
            console.log(error);
            return next(
                new exceptions.BadEntity(error)
            );
        }

        email.newMessage(data.toId);
        response.json(messages);
    });
});

router.patch('/v1/message/read/:messageId', function (request, response, next) {
    var message = new Message(),
        messageId = request.params.messageId,
        accountId = request.account.id;

    message.read(accountId, messageId, function (error) {
        if (error) {
            console.log(error);
            return next(
                new exceptions.BadEntity(error)
            );
        }

        response.json(true);
    });

});

router.post('/v1/message/reply', replyValidation, function (request, response, next) {
    var message = new Message(),
        data = request.body || {};

    if (!request.form.isValid) {
        return next(
            new exceptions.BadEntity({validation: request.form.errors })
        );
    }

    data.fromId = request.account.id;
    message.reply(data, function (error, messages) {
        if (error) {
            console.log(error);
            return next(
                new exceptions.BadEntity(error)
            );
        }

        message = new Message();
        message.fromId(data.replyTo, function (error, message) {
            if (error) {
                return console.log(error);
            }

            email.newMessage(message[0].from_id);
        });

        response.json(messages);
    });
});

module.exports = router;
