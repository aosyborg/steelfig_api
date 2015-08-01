var rdb = require('../rdb');

function Account() {
    name = '';
}

Account.prototype.fromUser = function (user, callback) {
    var sql = rdb.format('SELECT * FROM accounts WHERE id = ? LIMIT 1', [user.account_id]);
    console.log(sql);
    rdb.query(sql, function (error, rows) {
        if (error || !rows.length) {
            return callback(false);
        }

        var row = rows[0];
        this.name = row.name;
        callback(this);
    }.bind(this));
};

Account.prototype.toJson = function () {
    return {
        name: this.name
    }
};

module.exports = Account;
