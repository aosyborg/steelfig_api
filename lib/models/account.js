var rdb = require('../rdb');

function Account() {
    name = '';
}

Account.prototype.fromUser = function (user, callback) {
    var sql = rdb.format('SELECT * FROM accounts WHERE id = ? LIMIT 1', [user.accountId]);
    rdb.query(sql, function (error, rows) {
        if (error || !rows.length) {
            return callback(error);
        }

        var row = rows[0];
        this.id = row.id;
        this.name = row.name;
        callback(null, this);
    }.bind(this));
};

Account.prototype.update = function (data, callback) {
    var sql = rdb.format('UPDATE accounts SET name = COALESCE(?, name) WHERE id = ?',
            [data.name, this.id]);
    rdb.query(sql, function (error, result) {
        if (error) {
            return callback(error);
        }

        this.fromUser({accountId: this.id}, callback);
    }.bind(this));
};

Account.prototype.toJson = function () {
    return {
        id: this.id,
        name: this.name
    }
};

Account.prototype.link = function (eventId, orgAccountId, newAccountId, callback) {
    var sql = rdb.format('CALL link_account(?, ?, ?)',
            [eventId, orgAccountId, newAccountId]);
    rdb.query(sql, function (error) {
        callback(error, this);
    }.bind(this));
};

Account.prototype.unlink = function (userId, callback) {
    var sql = rdb.format('CALL unlink_account(?)', [userId]);
    rdb.query(sql, function (error) {
        callback(error, this);
    }.bind(this));
};

module.exports = Account;
