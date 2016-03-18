var rp = require('request-promise');

module.exports.run = function (client) {

    function get_random_dx_product_url() {
        var last_product_id = 394255;
        var dealextreme_url = 'http://www.dx.com';
        var random_product_id = Math.floor(Math.random() * (last_product_id - 500)) + 500;

        return dealextreme_url + '/p/' + random_product_id;
    }

    function get_dx_product(channel) {

        var dx_url = get_random_dx_product_url();

        rp(dx_url).then(function() {
            client.say(channel, 'Random DealExtreme product: ' + dx_url);
        }).catch(function() {
            get_dx_product(channel);
        });

    }

    client.addListener('message', function(nick, channel, message) {
        params = message.split(' ');

        if (params[0] == '.dx') {
            get_dx_product(channel);
        }

    });
};
