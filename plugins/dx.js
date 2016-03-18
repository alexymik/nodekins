module.exports.run = function (client) {
    client.addListener('message', function(nick, channel, message) {
        var params = message.split(' ');

        if (params[0] == '.dx') {

            var last_product_id = 394255;
            var dealextreme_url = 'http://www.dx.com';

            var random_product_id = Math.floor(Math.random() * (last_product_id - 500)) + 500;

            client.say(channel, 'I dont work: ' + dealextreme_url + '/p/' + random_product_id);

            // TODO: Check if the URL is a 404, generate a new one before returning.
        }

    });
};
