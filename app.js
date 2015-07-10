var fs = require('fs');
var irc = require('irc');

// Open config.json file
var config_output = fs.readFileSync('config.json', 'utf8', function (err) {
    if (err) {
        console.log('Error opening/reading config.json. Rename config-example.json to config.json to use.');
        process.exit(1);
    }
});

// Parse the config
config = JSON.parse(config_output);

['server', 'nick'].forEach(function(currentValue) {
    if (! config[currentValue]) {
        console.log('Missing config values, check your config.json');
        process.exit(1);
    }
});

var client = new irc.Client(config.server, config.nick, {
    debug: false,
    channels: config.channels
});

client.addListener('registered', function(message) {
    // Stuff to do after connecting here
    console.log('Connected to ' + message.server)
});

if (config.plugins) {
    config.plugins.forEach(function(currentValue) {
        require('./plugins/' + currentValue).run(client);
    });
}

client.addListener('message', function(nick, channel, message) {
    params = message.split(' ');

    if (params[0] == '.commands') {
        client.say(channel, 'Loaded commands: ' + config.plugins.join(' '));
    }
});