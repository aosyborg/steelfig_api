var rdb = require('../rdb'),
    _ = require('lodash');

function Schedule() {
};

Schedule.prototype.fromEventId = function (eventId, callback) {
    var sql = rdb.format('SELECT * FROM schedules WHERE event_id = ?', [eventId]);

    rdb.query(sql, callback);
};

Schedule.prototype.add = function (data, callback) {
    var sql = rdb.format('INSERT INTO schedules SET ' +
        'event_id = ?, ' +
        'attendee_id = (SELECT id FROM attendees WHERE account_id = ?), ' +
        'busy_at = ? ',
        [data.eventId, data.accountId, data.busyAt]);
    console.log(sql);

    rdb.query(sql, function (error) {
        if (error) {
            return callback(error);
        }

        sql = 'SELECT * FROM schedules WHERE id = LAST_INSERT_ID()';
        rdb.query(sql, callback);
    }.bind(this));
};

Schedule.prototype.delete = function (accountId, scheduleId, callback) {
    var sql = rdb.format('' +
            'DELETE FROM schedules ' +
            'WHERE id = ? ' +
            'AND attendee_id = (SELECT id FROM attendees WHERE account_id = ?)',
            [scheduleId, accountId]);

    rdb.query(sql, callback);
};

module.exports = Schedule;
