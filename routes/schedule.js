var express = require('express'),
    router = express.Router(),
    async = require('async'),
    exceptions = require('../lib/exceptions'),
    Schedule = require('../lib/models/schedule');

var getScheduleValidation = require('../lib/validation/v1_get_schedule'),
    postScheduleValidation = require('../lib/validation/v1_post_schedule');

router.get('/v1/schedule', getScheduleValidation, function (request, response, next) {
    var schedule = new Schedule()
        eventId = request.query.eventId;

    if (!request.form.isValid) {
        return next(
            new exceptions.BadEntity({validation: request.form.errors })
        );
    }

    schedule.fromEventId(eventId, function (error, schedules) {
        if (error) {
            console.log(error);
            return next(
                new exceptions.BadEntity(error)
            );
        }

        response.json(schedules);
    });
});

router.post('/v1/schedule', postScheduleValidation, function (request, response, next) {
    var schedule = new Schedule(),
        data = request.form;

    if (!request.form.isValid) {
        return next(
            new exceptions.BadEntity({validation: request.form.errors })
        );
    }

    data.accountId = request.account.id;
    schedule.add(request.form, function (error, day) {
        if (error) {
            console.log(error);
            return next(
                new exceptions.BadEntity(error)
            );
        }

        response.json(day[0]);
    });
});

router.delete('/v1/schedule/:scheduleId', function (request, response, next) {
    var schedule = new Schedule(),
        scheduleId = request.params.scheduleId,
        accountId = request.account.id;

    schedule.delete(accountId, scheduleId, function (error) {
        if (error) {
            console.log(error);
            return next(
                new exceptions.NotFound(error)
            );
        }

        response.json(true);
    });
});

module.exports = router;
