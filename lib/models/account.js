var Q = require('q');
var rdb = require('../rdb');

var Account = function () {
    var self = this,
        properties = {};

    this.from_token = function (token) {
        var deferred = Q.defer();

        if (!token || /^Bearer .+/.test(token) === false) {
            return false;
        }

        token = token.replace(/^Bearer\s+/, '');
        rdb.query('SELECT * FROM v_accounts WHERE token = ? LIMIT 1', [token],
            function (error, rows) {
                if (rows.length > 0) {
                    properties = rows[0];
                }
                deferred.resolve(self);
            }
        );

        return deferred.promise;
    };

    this.toJson = function () {
        return properties;
    }
};

module.exports = Account;
