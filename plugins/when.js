//var moment = require('moment');
//var localStorage = require('node-localstorage');
//
//module.exports.run = function (client) {
//    client.addListener('message', function(nick, channel, message) {
//        exploded_message = message.split(' ');
//
//        if (exploded_message[0] == '.when') {
//
//
//            // Check for proper amount of args
//            if (exploded_message.length < 2) {
//                client.say(channel, '.when event (time)');
//                return
//            }
//
//            // Get stored list of args
//            var whens = JSON.parse(localStorage.getItem('when'));
//
//            // Check if key exists
//            if (whens[exploded_message[1]]) {
//                if (exploded_message[2]) {
//                    when = moment(whens[exploded_message[1]]);
//
//                    if (when.isValid()) {
//
//                    } else {
//
//                    }
//                } else {
//                    when = moment(whens[exploded_message[1]]);
//
//
//                }
//
//            } else {
//                client.say(channel, 'Not found. Set an event time with ".when event time"')
//            }
//
//            client.say(channel, 'Metal Gear Solid 5: The Phantom Pain releases in: ' + moment('2015-09-01').fromNow())
//        }
//    });
//};
//
