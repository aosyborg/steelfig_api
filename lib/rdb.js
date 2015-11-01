var mysql = require('mysql'),
    config = require('../config');

var client = mysql.createConnection(config.mysql);

function autoReconnect (client) {
    client.on('error', function (error) {
        if (!error.fatal) {
            return;
        }

        if (error.code !== 'PROTOCOL_CONNECTION_LOST') {
            throw error;
        }

        client = mysql.createConnection(config.mysql);
        autoReconnect(client);
        client.connect(function (error) {
            if (error) {
                // Well we tried but the db probably fell over.
                console.error(error);
            }
        });

    });
}

autoReconnect(client);

module.exports = client;
