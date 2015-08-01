var mysql = require('mysql'),
    config = require('../config');

var connection = mysql.createConnection(config.mysql);
connection.connect(function (error) {
    if (error) {
        return console.error('Error connection to db: ' + error.stack);
    }
});

module.exports = connection;
