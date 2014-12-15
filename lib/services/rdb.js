var _ = require('lodash');

module.exports = Rdb;

// Requires
var mysql = require('mysql');

// Module definition
function Rdb (options) {
    var config = {
        host: 'localhost',
        port: 3306,
        database: null,
        user: 'root',
        password: null
    };

    _.assign(config, options || {});
    this.pool = mysql.createPool(config);
}

/**
 * Queries the database - pool will be initialized if not already done
 */
Rdb.prototype.query = function (query, data, callback) {
    console.log('Running query:', query);
    this.pool.query(query, data, callback);
};
