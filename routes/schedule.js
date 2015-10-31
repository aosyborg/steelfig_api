var express = require('express'),
    router = express.Router(),
    async = require('async'),
    exceptions = require('../lib/exceptions'),
    Schedule = require('../lib/models/schedule');

var getScheduleValidation = require('../lib/validation/v1_get_schedule'),
    patchScheduleValidation = require('../lib/validation/v1_patch_schedule');

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

router.patch('/v1/schedule', patchScheduleValidation, function (request, response, next) {
    var schedule = new Schedule(),
        data = request.form;

    if (!request.form.isValid) {
        return next(
            new exceptions.BadEntity({validation: request.form.errors })
        );
    }

    data.accountId = request.account.id;
    schedule.modify(request.form, function (error, day) {
        if (error) {
            console.log(error);
            return next(
                new exceptions.BadEntity(error)
            );
        }

        response.json(day[0]);
    });
});

module.exports = router;
