var _ = require('lodash');

module.exports = function (environment) {
    var config = {
        defaults: {
            mysql: {
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'steelfig'
            }
        },
        development: {
        }
    };

    return _.assign({}, config.defaults, config[environment]);
}(process.env.APPLICATION_ENV || 'development');
