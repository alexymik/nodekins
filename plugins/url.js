var MetaInspector = require('node-metainspector');

module.exports.run = function (client) {
    client.addListener('message', function(nick, channel, message) {
        var params = message.split(' ');


        params.forEach(function (param) {
            var meta = new MetaInspector(param, {limit: 3000000});

            meta.on('fetch', function () {
                if (meta.title) {
                    client.say(channel, meta.title.trim().replace(/(\r\n|\n|\r)/gm, ' '));
                }
            });

            meta.on("error", function (err) {
                // Fail silently
            });

            meta.fetch();

        });
    });
};
