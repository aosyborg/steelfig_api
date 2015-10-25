var form = require('express-form'),
    field = form.field;

module.exports = form(
    field('eventId')
        .required()
        .isInt(),

    field('toId')
        .required()
        .trim()
        .isInt(),

    field('subject')
        .required()
        .trim()
        .maxLength(255),

    field('message')
        .required()
        .trim()
);
