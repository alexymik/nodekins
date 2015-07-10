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

config.plugins.forEach(function(currentValue) {
    require('./plugins/' + currentValue).run(client);
});

client.addListener('message', function(nick, channel, message) {
    params = message.split(' ');

    if (params[0] == '.commands') {
        // @TODO: Make a plugin registry that reports which are loaded

        client.say(channel, 'Loaded commands: ' + config.plugins.join(' '));
    }

    // Core commands should be here

});