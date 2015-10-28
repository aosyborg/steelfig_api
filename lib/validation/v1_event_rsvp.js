var form = require('express-form'),
    field = form.field;

module.exports = form(
    field('eventId')
        .required()
        .isInt(),

    field('status')
        .required()
        .isInt(),

    field('comment')
        .trim()
        .maxLength(255)
);
