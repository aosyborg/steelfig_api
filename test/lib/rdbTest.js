var assert = require('assert');
var rdb = require('../../lib/rdb');

describe('Rdb', function () {
    describe('query()', function () {
        it('should call pool.query', function () {
            var pool = {
                query: function () {
                    assert.ok(true);
                }
            }
            rdb.setPool(pool);
            rdb.query();
        });
    });
});
