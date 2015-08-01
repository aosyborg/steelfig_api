var _ = require('lodash');

var http_status_codes = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500
}

module.exports.SteelfigException = function (options) {
    defaults = {
        name: 'SteelfigException',
        message: 'An error has occurred',
        statusCode: http_status_codes.INTERNAL_SERVER_ERROR,
        errors: null,
        validation: null
    };

    settings = _.assign(defaults, options);

    this.name = settings.name;
    this.message = settings.message;
    this.statusCode = settings.statusCode;
    this.errors = settings.errors;
    this.validation = settings.validation;
}

module.exports.BadRequest = function (options) {
    return new module.exports.SteelfigException(_.assign({
        name: 'BadRequest',
        statusCode: http_status_codes.BAD_REQUEST,
    }, options));
};

module.exports.Unauthorized = function (options) {
    return new module.exports.SteelfigException(_.assign({
        name: 'Unauthorized',
        statusCode: http_status_codes.UNAUTHORIZED
    }, options));
};

module.exports.Forbidden = function (options) {
    return new module.exports.SteelfigException(_.assign({
        name: 'Forbidden',
        statusCode: http_status_codes.FORBIDDEN
    }, options));
};

module.exports.NotFound = function (options) {
    return new module.exports.SteelfigException(_.assign({
        name: 'NotFound',
        statusCode: http_status_codes.NOT_FOUND
    }, options));
};

module.exports.BadEntity = function (options) {
    return new module.exports.SteelfigException(_.assign({
        name: 'BadEntity',
        statusCode: http_status_codes.UNPROCESSABLE_ENTITY
    }, options));
};

module.exports.InternalServerError = function (options) {
    return new module.exports.SteelfigException(_.assign({
        name: 'InternalServerError',
        statusCode: http_status_codes.INTERNAL_SERVER_ERROR
    }, options));
};
