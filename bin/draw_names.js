var AWS = require('aws-sdk'),
    rdb = require('../lib/rdb'),
    config = require('../config');

var ses = new AWS.SES(config.aws);

var accountsSql = rdb.format('SELECT account_id FROM attendees WHERE status = 1 ORDER BY RAND()');
rdb.query(accountsSql, function (error, accounts) {
    if (error) {
        console.log(error);
        process.exit(1);
    }

    for (var i in accounts) {
        var a = accounts[i].account_id,
            b = (i == accounts.length - 1) ? accounts[0].account_id : accounts[++i].account_id;
        sendNotice(a, b);
    }
});

var userInfoSql = '' +
    'SELECT users.email, accounts.name ' +
    'FROM users JOIN accounts ON users.account_id = accounts.id ' +
    'where accounts.id = ?';
var buyingForInfoSql = 'SELECT name FROM accounts WHERE id = ?';
function sendNotice (account_id, buying_for_id) {
    rdb.query(rdb.format(userInfoSql, [account_id]), function (error, users) {
        if (error) {
            console.log(error);
            process.exit(1);
        }

        rdb.query(rdb.format(buyingForInfoSql, [buying_for_id]), function (error, buyingForInfo) {
            if (error) {
                console.log(error);
                process.exit(1);
            }

            var to = [];
            for (var i in users) {
                to.push(users[i].email);
            }

            var message = '' +
                    'Hi ' + users[0].name + '!\n\n' +
                    'Good news, the drawing has taken place for the 2015 Christmas Gift Exchange!\n\n' +
                    'This year you will buying gifts for: ' + buyingForInfo[0].name + '\n\n' +
                    'This is a good time to remind you to keep your list up-to-date and remember people give ' +
                    'their withlists to others so always mark an item as purchased if you bought it!\n\n' +
                    'Merry Christmas!',
                params = {};

                params = {
                    Source: 'noreply@steelfig.com',
                    Destination: { ToAddresses: to },
                    Message: {
                        Subject: {
                            Data: "Steelfig 2015: Names have been drawn!"
                        },
                        Body: {
                            Text: {
                                Data: message
                            }
                        }
                    }
                };

                ses.sendEmail(params, function (error, data) {
                    if (error) {
                        console.log(error);
                        process.exit(1);
                    }
                });
        });
    });
}
