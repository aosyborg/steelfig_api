var form = require('express-form'),
    field = form.field;

module.exports = form(
    field('eventId')
        .required()
        .isInt(),

    field('name')
        .required()
        .trim()
        .maxLength(255),

    field('price')
        .trim()
        .isNumeric(),

    field('url')
        .trim()
        .isUrl(),

    field('comments')
        .trim()
);
