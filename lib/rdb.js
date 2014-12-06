var mysql = require('mysql');
var config = require('../config/config');

var Rdb = function () {
    var methods = {},
        pool;

    /**
     * Constructor
     */
    methods.init = function () {
        pool = mysql.createPool({
            host: config.mysql.host || 'localhost',
            port: config.mysql.host || 3306,
            database: config.mysql.database || null,
            user: config.mysql.user || 'root',
            password: config.mysql.password || null
        });
    };

    this.query = function (query, data, callback) {
        pool.query(query, data, callback);
    };

    methods.init();
};

module.exports = new Rdb();
