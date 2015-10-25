var rdb = require('../rdb'),
    _ = require('lodash');

function Message() {
};

Message.prototype.fetchAll = function (accountId, eventId, callback) {
    var sql = rdb.format('' +
        'SELECT accounts.name, messages.id, messages.from_id, messages.to_id, ' +
        'messages.subject, messages.message, messages.created_at, messages.read_at ' +
        'FROM messages ' +
        'JOIN accounts ON messages.to_id = accounts.id ' +
        'WHERE messages.event_id = ? ' +
        'AND messages.to_id = ? ' +
        'OR messages.from_id = ? ' +
        'ORDER BY created_at DESC',
        [eventId, accountId, accountId]);

    rdb.query(sql, function (error, rows) {
        var results = {
            inbox: [],
            sent: []
        };

        if (error) {
            return callback(error);
        }

        console.log(rows);
        for (var i in rows) {
            if (rows[i].from_id == accountId) {
                results.sent.push({
                    id: rows[i].id,
                    name: rows[i].name,
                    subject: rows[i].subject,
                    message: rows[i].message,
                    created_at: rows[i].created_at,
                    read_at: rows[i].read_at
                });

            } else {
                results.inbox.push({
                    id: rows[i].id,
                    subject: rows[i].subject,
                    message: rows[i].message,
                    created_at: rows[i].created_at,
                    read_at: rows[i].read_at
                });
            }
        }

        callback(null, results);
    }.bind(this));
};

Message.prototype.create = function (data, callback) {
    var sql = rdb.format('CALL set_message(?, ?, ?, ?, ?)',
        [data.eventId, data.fromId, data.toId, data.subject, data.message]);

    rdb.query(sql, function (error, rows) {
        if (error) {
            return callback(error);
        }

        return this.fetchAll(data.fromId, data.eventId, callback);
    }.bind(this));
};

Message.prototype.read = function (accountId, messageId, callback) {
    var sql = rdb.format('' +
            'UPDATE messages ' +
            'SET read_at = NOW() ' +
            'WHERE id = ? ' +
            'AND to_id = ? ' +
            'LIMIT 1',
            [messageId, accountId]);
    rdb.query(sql, callback);
};

Message.prototype.reply = function (data, callback) {
    var sql = rdb.format('CALL reply_message(?, ?, ?, ?, ?)',
        [data.eventId, data.replyTo, data.fromId, data.subject, data.message]);
    rdb.query(sql, function (error, rows) {
        if (error) {
            return callback(error);
        }

        return this.fetchAll(data.fromId, data.eventId, callback);
    }.bind(this));
};

module.exports = Message;
