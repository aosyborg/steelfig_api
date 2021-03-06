var rdb = require('../rdb'),
    _ = require('lodash');

function Schedule() {
};

Schedule.prototype.fromEventId = function (eventId, callback) {
    var sql = rdb.format('' +
        'SELECT schedules.* ' +
        'FROM schedules ' +
        'JOIN attendees ON schedules.attendee_id = attendees.id ' +
        'WHERE attendees.event_id = ?',
        [eventId]);

    rdb.query(sql, function (error, rows) {
        var date;

        if (error) {
            return callback(error);
        }

        for (var i in rows) {
            date = new Date(rows[i].available_at);
            rows[i].available_at = date.toString().replace(/\sGMT.*$/, '');
            //rows[i].available_at = '' +
            //    date.getFullYear() + '-' +
            //    (date.getMonth() + 1) + '-' +
            //    date.getDate() + ' ' +
            //    date.getHours() + ':00';
        }

        return callback(error, rows);
    });
};

Schedule.prototype.modify = function (data, callback) {
    var sql = rdb.format('CALL modify_availability(?, ?, ?)',
        [data.eventId, data.accountId, data.availableAt]);

    rdb.query(sql, callback);
};

module.exports = Schedule;
