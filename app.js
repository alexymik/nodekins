var fs = require('fs');
var irc = require('irc');

var config_output = fs.readFileSync('config.json', 'utf8', function (err) {
    if (err) {
        console.log('Error opening/reading config.json');
        process.exit(1);
    }
});

config = JSON.parse(config_output);

var client = new irc.Client(config.server, config.nick, {
    debug: false,
    channels: config.channels
});

client.addListener('registered', function(message) {

    // Stuff to do after connecting here

    console.log('Connected to ' + message.server)
});

client.addListener('message', function(nick, channel, message) {
    exploded_message = message.split(' ');

    // Core commands should be here

});

require('./plugins/note').run(client);
require('./plugins/when').run(client);