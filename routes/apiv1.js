var express = require('express'),
    router = express.Router(),
    error_response = require('./errors');

module.exports = new Controller;

function Controller () { }

Controller.prototype.setModelFactory = function (model_factory) {
    this.model_factory = model_factory;
}

Controller.prototype.getRouter = function () {
    var self = this;
    /**
     * Use oauth token to grab account.
     * If an account does not exist, create one.
     */
    router.get('/v1/oauth', function (request, response, next) {
        response.json('Not implemented');
    });

    /**
     * Inject account into request from token
     */
    router.get('/v1/*', function (request, response, next) {
        var account_model = self.model_factory.create('account'),
            token = request.headers.authorization || false;

        // Load account
        account_model.from_token(token).then(function (account) {
            if (!account) {
                return error_response(request, response, {
                    status: 401,
                    message: 'No token supplied'
                });
            }

            request.account = account;
            next('route');
        });
    });

    router.get('/v1/:entity/:id?', function (request, response) {
        response.json({
            account: request.account.toJson(),
        });
    });

    return router;
}
