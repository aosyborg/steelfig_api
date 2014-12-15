var assert = require('assert');
var Account = require('../../../lib/models/account');

describe('models/Account', function () {
    describe('from_token()', function () {
        it('should should return a promise', function () {
            var account = new Account(),
                actual = account.from_token('abc').constructor.name,
                expected = 'Promise';
            assert.equal(expected, actual);
        });
        it('promise should resolve to false on bad token', function () {
            var account = new Account(),
                promise = account.from_token('abc'),
                expected = false;
            promise.then(function (actual) {
                assert.equal(expected, actual);
            });
        });
    });

    describe('toJson()', function () {
        it('should return a json object', function () {
            var account = new Account(),
                actual = typeof account.toJson(),
                expected = 'object';
            assert.equal(expected, actual);
        });
    });
});

