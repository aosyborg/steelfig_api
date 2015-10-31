var _ = require('lodash');

module.exports = {
    mysql: {
        host: process.env.STEELFIG_DB_HOST ||'localhost',
        user: process.env.STEELFIG_DB_USER || 'root',
        password: process.env.STEELFIG_DB_PASSWORD || '',
        database: 'steelfig'
    }
};
