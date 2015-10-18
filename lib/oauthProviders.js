var google = require('googleapis');
var exceptions = require('./exceptions');
var plus = google.plus('v1');

module.exports.googleUser = function (token, callback) {
    plus.people.get({
        userId: 'me',
        access_token: token
    }, function (error, data) {
        var userData = {};

        if (error) {
            var message = error.errors[0].message
            var e = new exceptions.Unauthorized({message: message});
            return callback(e);
        }

        // Pull email
        for (var i in data.emails) {
            if (data.emails[i].type === 'account') {
                userData.email = data.emails[i].value;
                break;
            }
        }

        // Pull name
        userData.name = data.displayName;

        // Pull avatar
        userData.avatar = data.image.url;

        callback(null, userData);
    });
};

