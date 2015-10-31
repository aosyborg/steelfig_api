var form = require('express-form'),
    field = form.field;

module.exports = form(
    field('eventId')
        .required()
        .isInt(),

    field('availableAt')
        .required()
        .regex(/\d{4}\-\d{1,2}\-\d{1,2}\s\d{1,2}:\d{2}/)
);
