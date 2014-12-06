var express = require('express');
var router = express.Router();
var error_response = require('./errors');

var models = {
    Account: require('../lib/models/account')
};

router.get('/v1/*', function (request, response, next) {
    var account_model = new models.Account(),
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
        entity: request.params.entity,
        id: request.params.id || null
    });
});

module.exports = router;
