var _ = require('lodash');

module.exports = {
    mysql: {
        host: process.env.STEELFIG_DB_HOST ||'localhost',
        user: process.env.STEELFIG_DB_USER || 'root',
        password: process.env.STEELFIG_DB_PASSWORD || '',
        database: 'steelfig'
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'us-east-1'
    }
};
