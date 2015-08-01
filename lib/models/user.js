var rdb = require('../rdb');

function User() {
    this.id = null;
    this.account_id = null;
    this.email = null;
    this.name = null;
    this.oauth_token = null;
    this.api_token = null;
    this.avatar = null;
    this.activated_at = null;
    this.created_at = null;
    this.updated_at = null;
}

User.prototype.fromToken = function (token, callback) {
    var sql = rdb.format('SELECT * FROM users WHERE api_token = ? LIMIT 1', [token]);
    rdb.query(sql, function (error, rows) {
        if (error || !rows.length) {
            return callback(false);
        }

        var row = rows[0];
        this.id = row.id;
        this.account_id = row.account_id;
        this.email = row.email;
        this.name = row.name;
        this.oauth_token = row.oauth_token;
        this.api_token = row.api_token;
        this.avatar = row.avatar;
        this.activated_at = row.activated_at;
        this.created_at = row.created_at;
        this.updated_at = row.updated_at;
        callback(this);
    }.bind(this));
};

User.prototype.toJson = function () {
    return {
        id: this.id,
        account_id: this.account_id,
        email: this.email,
        name: this.name,
        api_token: this.api_token,
        avatar: this.avatar,
        activated_at: this.activated_at,
        created_at: this.created_at,
        updated_at: this.updated_at
    }
};

module.exports = User;
