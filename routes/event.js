var express = require('express'),
    router = express.Router(),
    async = require('async'),
    exceptions = require('../lib/exceptions'),
    Attendees = require('../lib/models/attendees');

var inviteValidation = require('../lib/validation/v1_event_invite');

router.get('/v1/event/attendees/:eventId', function (request, response, next) {
    var eventId = request.params.eventId,
        attendeesModel = new Attendees();

    attendeesModel.fromEvent(eventId, function (error, attendees) {
        response.json({
            attendees: attendees.toJson()
        });
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

module.exports = router;
