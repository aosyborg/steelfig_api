var AWS = require('aws-sdk'),
    fs = require('fs'),
    path = require('path'),
    config = require('../config')
    rdb = require('./rdb'),
    User = require('./models/user');

var ses = new AWS.SES(config.aws),
    ROOT = path.dirname(process.mainModule.filename) + '/../templates';
    from = 'noreply@steelfig.com';

if (!config.aws.accessKeyId || !config.aws.secretAccessKey) {
    console.error('AWS environment variables not set!');
}

function getEventName(eventId, callback) {
    var sql = rdb.format('SELECT name FROM events WHERE id = ?', [eventId]);
    rdb.query(sql, function (error, rows) {
        if (error || !rows.length) {
            return callback(error);
        }

        var row = rows[0];
        callback(null, row.name);
    });
}

module.exports.sendInvite = function (invite, callback) {
    getEventName(invite.eventId, function (error, eventName) {
        fs.readFile(ROOT + '/invite.txt', 'utf-8', function (error, template) {
            if (error) {
                console.log(error);
                return callback(error);
            }

            template = template.replace(/NAME/, invite.name);
            template = template.replace(/EVENT_NAME/, eventName);
            template = template.replace(/MESSAGE/, invite.message || 'Participation is entirely volunteery. Please don\'t feel obligated!');
            var params = {
                Source: from,
                Destination: { ToAddresses: [invite.email] },
                Message: {
                    Subject: {
                        Data: "You're invited!"
                    },
                    Body: {
                        Text: {
                            Data: template
                        }
                    }
                }
            };

            ses.sendEmail(params, function (error, data) {
                if (error) {
                    console.log(error);
                }
            });
        });
    });
};

module.exports.notifyOfAccountLink = function (name, users, callback) {
    var sql = '',
        body = '';

    callback = callback || function () {};
    fs.readFile(ROOT + '/accountLink.txt', 'utf-8', function (error, template) {
        if (error) {
            console.log(error);
            return callback(error);
        }

        for (var i in users) {
            body = template;
            body = body.replace(/NAME/, users[i].name);
            body = body.replace(/USER/, name);
            var params = {
                Source: from,
                Destination: { ToAddresses: [users[i].email] },
                Message: {
                    Subject: {
                        Data: name + ' is joining forces with you on Steelfig!'
                    },
                    Body: {
                        Text: {
                            Data: body
                        }
                    }
                }
            };

            ses.sendEmail(params, function (error, data) {
                if (error) {
                    console.log(error);
                }
            });
        }
    });
};

module.exports.notifyOfAccountUnLink = function (name, users, callback) {
    var sql = '',
        body = '';

    callback = callback || function () {};
    fs.readFile(ROOT + '/accountUnlink.txt', 'utf-8', function (error, template) {
        if (error) {
            console.log(error);
            return callback(error);
        }

        for (var i in users) {
            body = template;
            body = body.replace(/NAME/, users[i].name);
            body = body.replace(/USER/, name);
            var params = {
                Source: from,
                Destination: { ToAddresses: [users[i].email] },
                Message: {
                    Subject: {
                        Data: name + ' has unlinked their account on Steelfig!'
                    },
                    Body: {
                        Text: {
                            Data: body
                        }
                    }
                }
            };

            ses.sendEmail(params, function (error, data) {
                if (error) {
                    console.log(error);
                }
            });
        }
    });
};

module.exports.newMessage = function (accountId, callback) {
    user = new User();

    callback = callback || function () {};
    user.fromAccountId(accountId, function (error, users) {
        fs.readFile(ROOT + '/newMessage.txt', 'utf-8', function (error, template) {
            if (error) {
                console.log(error);
                return callback(error);
            }

            for (var i in users) {
                body = template;
                body = body.replace(/NAME/, users[i].name);
                var params = {
                    Source: from,
                    Destination: { ToAddresses: [users[i].email] },
                    Message: {
                        Subject: {
                            Data: 'You have a new message on Steelfig!'
                        },
                        Body: {
                            Text: {
                                Data: body
                            }
                        }
                    }
                };

                ses.sendEmail(params, function (error, data) {
                    if (error) {
                        console.log(error);
                    }
                });
            }
        });
    });
};
