var express = require('express'),
    router = express.Router(),
    async = require('async'),
    exceptions = require('../lib/exceptions'),
    Attendees = require('../lib/models/attendees');

var inviteValidation = require('../lib/validation/v1_event_invite'),
    rsvpValidation = require('../lib/validation/v1_event_rsvp');

router.get('/v1/event/:eventId/attendees', function (request, response, next) {
    var eventId = request.params.eventId,
        attendeesModel = new Attendees();

    attendeesModel.fromEvent(eventId, function (error, attendees) {
        if (error) {
            console.log(error);
            return next(
                new exceptions.BadEntity(error)
            );
        }

        response.json({
            attendees: attendees.toJson()
        });
    });
});

router.get('/v1/event/:eventId/attendee/:attendeeId', function (request, response, next) {
    var attendeeId = request.params.attendeeId,
        accountId = request.account.id,
        attendeesModel = new Attendees();

    attendeesModel.fromId(attendeeId, accountId, function (error, attendee) {
        if (error) {
            console.log(error);
            return next(
                new exceptions.BadEntity(error)
            );
        }

        response.json(attendee[0]);
    });
});

router.post('/v1/event/invite', inviteValidation, function (request, response, next) {
    var attendeesModel = new Attendees();

    if (!request.form.isValid) {
        return next(
            new exceptions.BadEntity({validation: request.form.errors })
        );
    }

    attendeesModel.invite(request.body, function (error, attendees) {
        // TODO: email invitation
        response.json({
            attendees: attendees.toJson()
        });
    });
});

router.patch('/v1/event/rsvp', rsvpValidation, function (request, response, next) {
    var attendeesModel = new Attendees();

    if (!request.form.isValid) {
        return next(
            new exceptions.BadEntity({validation: request.form.errors })
        );
    }

    var data = {
        eventId: request.body.eventId,
        accountId: request.account.id,
        status: request.body.status,
        comment: request.body.comment
    }
    attendeesModel.rsvp(data, function (error) {
        if (error) {
            console.log(error);
            return next(
                new exceptions.BadEntity(error)
            );
        }

        response.json(true);
    });
});

module.exports = router;
