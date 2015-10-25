var rdb = require('../rdb');

function Account() {
    name = '';
}

Account.prototype.fromUser = function (user, callback) {
    var sql = rdb.format('SELECT * FROM accounts WHERE id = ? LIMIT 1', [user.accountId]);
    rdb.query(sql, function (error, rows) {
        if (error || !rows.length) {
            return callback(false);
        }

        var row = rows[0];
        this.id = row.id;
        this.name = row.name;
        callback(this);
    }.bind(this));
};

Account.prototype.toJson = function () {
    return {
        name: this.name
    }
};

Account.prototype.unlink = function (eventId, userId, callback) {
    var sql = rdb.format('CALL unlink_account(?, ?)', [eventId, userId]);
    rdb.query(sql, callback);
};

module.exports = Account;
