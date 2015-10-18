var express = require('express'),
    router = express.Router();

router.get('/', function (request, response, next) {
    response.json({
        version: '1.0',
        author: 'Dave Symons',
        routes: [
            '/v1/auth',
            '/v1/user',
            '/v1/account'
        ]
    });

    next();
});

module.exports = router;
