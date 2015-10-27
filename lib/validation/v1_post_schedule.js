var form = require('express-form'),
    field = form.field;

module.exports = form(
    field('eventId')
        .required()
        .isInt(),

    field('busyAt')
        .required()
        .regex(/\d{4}\-\d{2}\-\d{2}\s\d{2}:\d{2}/)
);
