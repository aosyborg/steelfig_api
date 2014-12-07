var Q = require('q');
var rdb = require('../rdb');

var Account = function () {
    var self = this,
        properties = {};

    this.from_token = function (token) {
        var deferred = Q.defer();

        token = String(token).replace(/^Bearer\s+/, '');
        rdb.query('CALL get_account(?)', [token], function (error, rows) {
                if (!rows || !Array.isArray(rows)) {
                    return deferred.resolve(false);
                }

                properties = rows[0][0];
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
