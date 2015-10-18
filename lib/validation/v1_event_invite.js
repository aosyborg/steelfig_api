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

    field('email')
        .required()
        .trim()
        .toLower()
        .isEmail(),

    field('message')
        .trim()
);
