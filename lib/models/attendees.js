var rdb = require('../rdb');

function Attendees() {
    this.attendees = [];
}

Attendees.prototype.fromEvent = function (eventId, callback) {
    var sql = rdb.format('' +
        'SELECT users.name AS user_name, users.id AS user_id, users.avatar, ' +
        '    accounts.name AS account_name, accounts.id AS account_id, '+
        '    attendees.status, attendees.comment ' +
        'FROM attendees ' +
        'JOIN accounts ON attendees.account_id = accounts.id ' +
        'JOIN users ON accounts.id = users.account_id ' +
        'WHERE attendees.event_id = ? ' +
        'ORDER BY users.created_at ASC',
        [eventId]);

    rdb.query(sql, function (error, rows) {
        if (error) {
            return callback(error);
        }

        for (var i in rows) {
            this.attendees.push({
                userName: rows[i].user_name,
                userId: rows[i].user_id,
                avatar: rows[i].avatar,
                accountName: rows[i].account_name,
                accountId: rows[i].account_id,
                status: rows[i].status,
                comment: rows[i].comment
            });
        }

        callback(null, this);
    }.bind(this));
};

Attendees.prototype.invite = function (invitation, callback) {
    var sql = rdb.format('CALL invite(?, ?, ?)',
        [invitation.name, invitation.email, invitation.eventId]);
    rdb.query(sql, this.fromEvent.bind(this, invitation.eventId, callback));
};

Attendees.prototype.toJson = function () {
    return this.attendees;
};

module.exports = Attendees;
