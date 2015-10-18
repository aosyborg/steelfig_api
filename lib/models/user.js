var rdb = require('../rdb');

function User() {
    this.id = null;
    this.accountId = null;
    this.email = null;
    this.name = null;
    this.apiToken = null;
    this.avatar = null;
    this.activatedAt = null;
    this.createdAt = null;
    this.updatedAt = null;
}

User.prototype.fromId = function (id, callback) {
    var sql = rdb.format('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
    rdb.query(sql, function (error, rows) {
        if (error || !rows.length) {
            return callback('User not found with give api token');
        }

        this.loadRecord(rows[0]);
        callback(null, this);
    }.bind(this));
};

User.prototype.fromToken = function (token, callback) {
    var sql = rdb.format('SELECT * FROM users WHERE api_token = ? LIMIT 1', [token]);
    rdb.query(sql, function (error, rows) {
        if (error || !rows.length) {
            return callback('User not found with give api token');
        }

        this.loadRecord(rows[0]);
        callback(null, this);
    }.bind(this));
};

User.prototype.fromEmail = function (email, callback) {
    var sql = rdb.format('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    rdb.query(sql, function (error, rows) {
        if (error || !rows.length) {
            return callback('Account doesn\'t exist');
        }

        this.loadRecord(rows[0]);
        callback(null, this);
    }.bind(this));
};

User.prototype.save = function (callback) {
    callback = callback || function () {};
    if (!this.id) {
        return callback('TODO: save new users');
    }

    var sql = rdb.format('UPDATE users SET name = ?, avatar = ?, WHERE id = ? LIMIT 1',
            [this.name, this.avatar, this.id]);
    rdb.query(sql, function (error, rows) {
        if (error) {
            console.log(error);
            return callback(error);
        }
        callback(null, this);
    }.bind(this));
};

User.prototype.loadRecord = function (record) {
    this.id = record.id;
    this.accountId = record.account_id;
    this.email = record.email;
    this.name = record.name;
    this.apiToken = record.api_token;
    this.avatar = record.avatar;
    this.activatedAt = record.activated_at;
    this.createdAt = record.created_at;
    this.updatedAt = record.updated_at;
    return this;
}

User.prototype.toJson = function () {
    return {
        id: this.id,
        accountId: this.accountId,
        email: this.email,
        name: this.name,
        apiToken: this.apiToken,
        avatar: this.avatar,
        activatedAt: this.activatedAt,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    }
};

module.exports = User;
