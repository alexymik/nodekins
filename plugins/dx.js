module.exports.run = function (client) {
    client.addListener('message', function(nick, channel, message) {
        params = message.split(' ');

        if (params[0] == '.dx') {

            var last_product_id = 394255;
            var dealextreme_url = 'http://www.dx.com';

            var random_product_id = Math.random(1, last_product_id);

            client.say(channel, 'Random DealExtreme product: ' + dealextreme_url + '/p/' + random_product_id);

            // TODO: Check if the URL is a 404, generate a new one before returning.
        }

    });
};