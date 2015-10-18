var express = require('express'),
    router = express.Router(),
    async = require('async'),
    exceptions = require('../lib/exceptions'),
    Wishlist = require('../lib/models/wishlist');

var itemValidation = require('../lib/validation/v1_wishlist_item');

router.get('/v1/wishlist', function (request, response, next) {
    var wishlistModel = new Wishlist();

    wishlistModel.fromAccount(request.user.accountId, function (error, wishlist) {
        response.json({
            wishlist: wishlist.toJson()
        });
    });
});

router.post('/v1/wishlist/item', itemValidation, function (request, response, next) {
    var wishlistModel = new Wishlist(),
        item = request.body || {};

    if (!request.form.isValid) {
        return next(
            new exceptions.BadEntity({validation: request.form.errors })
        );
    }

    item.accountId = request.user.accountId;
    wishlistModel.addItem(item, function (error, wishlist) {
        console.log(error);
        response.json({
            wishlist: wishlist.toJson()
        });
    });
});

router.delete('/v1/wishlist/item/:itemId', function (request, response, next) {
    var wishlistModel = new Wishlist(),
        itemId = request.params.itemId,
        accountId = request.user.accountId;

    wishlistModel.delete(itemId, accountId, function (error) {
        if (error) {
            console.log(error);
            return next(
                new exceptions.BadEntity(error)
            );
        }

        response.json(true);
    });

});

module.exports = router;
