var schedule = require('node-schedule');
require('datejs');
var moment = require('moment');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localStorage');

/**
 * @param client
 *
 * When plugin
 *
 * Depends on local storage & moment
 *
 * Basic overview: creates and retrieves event dates based on JSON keys. Powered by Date()'s date interpretation,
 * So specific dates are needed (no human language interpretation yet)
 *
 * Usage:
 *      .when
 *      > .when name (date)
 *
 *      .when something
 *      > Note not found, create one using: .when name (date)
 *
 *      .when something Jan 1, 2020
 *      > Saved
 *
 *      .when something
 *      > something is in (calculated time)
 */

module.exports.run = function (client) {

    // Get stored list of args for first run
    var whens = JSON.parse(localStorage.getItem('whens'));

    if (!whens) {
        whens = {};
    }

    // Create a memory based data structure to keep track of the scheduled announcements
    var when_schedules = {};

    for (var key in whens) {

        if(moment(whens[key]).isAfter(moment())) {
            when_schedules[key] = schedule.scheduleJob(Date.parse(moment(whens[key])._d), function(){
                client.say(config['channels'][0], key + ' is happening now.');
            });
        }

    }

    client.addListener('message', function(nick, channel, message) {
        params = message.split(' ');

        if (params[0] == '.when') {

            // Check for proper amount of args
            if (params.length < 2) {
                client.say(channel, ".when name (date)");
                return
            }

            params[1] = params[1].toLowerCase();

            if (params[1] && params[2]) {

                var when = moment(Date.parse(message.substr(params[0].length + params[1].length + 2)));

                if (when.isValid()) {
                    whens[params[1]] = when.toISOString();


                    localStorage.setItem('whens', JSON.stringify(whens));

                    client.say(channel, 'Saved ' + params[1] + ', ' + when.fromNow());

                    if (when_schedules && when_schedules[params[1]]) {
                        when_schedules[params[1]].cancel();
                    }
                    
                    var key = params[1];

                    when_schedules[params[1]] = schedule.scheduleJob(Date.parse(when._d), function() {
                        client.say(channel, key + ' is happening now.');
                    });

                } else {
                    client.say(channel, 'Invalid time/date');
                }

                return;
            }

            // Check if key exists
            if (whens[params[1]]) {
                var whenMoment = moment(whens[params[1]]);
                client.say(channel, params[1] + ': ' + whenMoment.fromNow() + ', on ' + whenMoment._d);
            } else {
                client.say(channel, 'Not found. Create a new countdown with ".when name (date)"')
            }
        }
    });
};

