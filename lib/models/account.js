
module.exports = Account;

var Q = require('q');

function Account () {
    this.properties = {};
    this.rdb = null;
};

Account.prototype.setRdb = function (rdb) {
    this.rdb = rdb;
}

Account.prototype.from_token = function (token) {
    var self = this;
        deferred = Q.defer();

    token = String(token).replace(/^Bearer\s+/, '');
    this.rdb.query('CALL get_account(?)', [token], function (error, rows) {
        if (!rows || !Array.isArray(rows)) {
            return deferred.resolve(false);
        }

        self.properties = rows[0][0];
        deferred.resolve(self);
    });

    return deferred.promise;
};

Account.prototype.toJson = function () {
    return this.properties;
};
