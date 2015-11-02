var mysql = require('mysql'),
    config = require('../config');

var pool = mysql.createPool(config.mysql);

function query(sql, callback) {
    pool.getConnection(function (error, connection) {
        if (error) {
            console.log(error);
            connection.release();
            return;
        }

        connection.query(sql, function (error, rows, results) {
            connection.release();
            callback(error, rows, results);
        });
    });
}

module.exports.format = mysql.format;
module.exports.query = query;
