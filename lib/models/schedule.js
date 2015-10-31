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

    rdb.query(sql, callback);
};

Schedule.prototype.modify = function (data, callback) {
    var sql = rdb.format('CALL modify_availability(?, ?, ?)',
        [data.eventId, data.accountId, data.availableAt]);
    console.log(sql);

    rdb.query(sql, callback);
};

module.exports = Schedule;
