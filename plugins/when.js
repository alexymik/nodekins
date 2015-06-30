var moment = require('moment');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localStorage');

module.exports.run = function (client) {
    client.addListener('message', function(nick, channel, message) {
        params = message.split(' ');

        if (params[0] == '.when') {

            // Check for proper amount of args
            if (params.length < 2) {
                client.say(channel, ".when name (date)");
                return
            }

            // Get stored list of args
            var whens = JSON.parse(localStorage.getItem('whens'));

            if (!whens) {
                whens = {};
            }

            if (params[1] && params[2]) {

                when = moment(message.substr(params[0].length + params[1].length + 2));

                if (when.isValid()) {
                    whens[params[1]] = when.toISOString();

                    localStorage.setItem('whens', JSON.stringify(whens));

                    client.say(channel, 'Saved ' + params[1] + ', ' + when.fromNow());
                } else {
                    client.say(channel, 'Invalid time/date');
                }

                return;
            }

            // Check if key exists
            if (whens[params[1]]) {
                client.say(channel, params[1] + ' is ' + moment(whens[params[1]]).fromNow());
            } else {
                client.say(channel, 'Not found. Create a new countdown with ".when name (date)"')
            }
        }
    });
};

