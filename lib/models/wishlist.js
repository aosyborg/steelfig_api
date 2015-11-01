var rdb = require('../rdb'),
    _ = require('lodash');

function Wishlist() {
    this.items = [];
};

Wishlist.prototype.fromAccount = function (accountId, callback) {
    var sql = rdb.format('' +
        'SELECT wishlists.* ' +
        'FROM wishlists ' +
        'JOIN attendees ON wishlists.attendee_id = attendees.id ' +
        'WHERE attendees.account_id = ? ' +
        'ORDER BY wishlists.sort ASC',
        [accountId]);

    rdb.query(sql, function (error, rows) {
        if (error) {
            return callback(error);
        }

        for (var i in rows) {
            this.items.push({
                id: rows[i].id,
                name: rows[i].name,
                barcode: rows[i].barcode,
                url: rows[i].url,
                price: rows[i].price,
                sort: rows[i].sort,
                comments: rows[i].comments
            });
        }

        callback(null, this);
    }.bind(this));
};

Wishlist.prototype.fromAttendee = function (attendeeId, accountId, callback) {
    var sql = rdb.format('' +
        'SELECT wishlists.* ' +
        'FROM wishlists ' +
        'JOIN attendees ON wishlists.attendee_id = attendees.id ' +
        'WHERE attendees.id = ? ' +
        'AND attendees.account_id != ?',
        [attendeeId, accountId]);

    rdb.query(sql, function (error, rows) {
        if (error) {
            return callback(error);
        }

        for (var i in rows) {
            this.items.push({
                id: rows[i].id,
                name: rows[i].name,
                barcode: rows[i].barcode,
                url: rows[i].url,
                price: rows[i].price,
                sort: rows[i].sort,
                comments: rows[i].comments,
                isPurchased: rows[i].is_purchased
            });
        }

        callback(null, this);
    }.bind(this));
};

Wishlist.prototype.addItem = function (item, callback) {
    item = _.extend({
        id: null,
        accountId: 0,
        eventId: 0,
        name: "",
        url: null,
        price: 0,
        isPurchased: false,
        sort: 1000,
        comments: ""
    }, item || {});

    if (item.url && !/^https?:\/\//i.test(item.url)) {
        item.url = 'http://' + item.url;
    }

    var sql = rdb.format('' +
        'CALL set_wishlist(?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [item.id, item.accountId, item.eventId, item.name, item.url,
        item.price, item.isPurchased, item.sort, item.comments]);

    rdb.query(sql, function (error, rows) {
        if (error) {
            return callback(error);
        }

        this.fromAccount(item.accountId, callback);
    }.bind(this));
};

Wishlist.prototype.delete = function (itemId, accountId, callback) {
    var sql = rdb.format('' +
        'DELETE w FROM wishlists w ' +
        'JOIN attendees ON w.attendee_id = attendees.id ' +
        'WHERE w.id = ? ' +
        'AND attendees.account_id = ?',
        [itemId, accountId]);

    rdb.query(sql, function (error, rows) {
        return callback(error, true);
    });
};

Wishlist.prototype.markPurchased = function (itemId, accountId, callback) {
    // You can only purchase items that don't belong to you but are in the same event
    var sql = rdb.format('CALL mark_purchased(?, ?)',
        [itemId, accountId]);

    rdb.query(sql, callback);
};

Wishlist.prototype.toJson = function() {
    return this.items;
};

module.exports = Wishlist;
