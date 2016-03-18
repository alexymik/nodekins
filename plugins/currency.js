var rp = require('request-promise');

var fetchCurrency = function(base) {

    return rp.get(
        {
            uri: 'https://api.fixer.io/latest?base=' + base,
            json: true
        }
    );

};

module.exports.run = function (client) {
    client.addListener('message', function(nick, channel, message) {
        var params = message.trim().split(' ');

        // Syntax: .cur 1 usd in cad
        // Params: 0    1 2   3  4

        // Convert 1 USD in/to CAD

        if (params[0] == '.currency') {

            // Prefetch exchange rates...

            fetchCurrency('USD').then(function (response) {

                console.log('Got exchange rates');

                var exchangeRates = response['rates'];
                var availableCurrencies = 'Available currencies are - USD ' + Object.keys(exchangeRates).join(' ');

                if (params.length == 2) {
                    // .cur cad

                    var requestedCurrency = params[1].toUpperCase();

                    if (exchangeRates[requestedCurrency]) {

                        client.say(channel, '1 USD = ' + exchangeRates[params[1].toUpperCase()] + ' ' + requestedCurrency);
                        // We have it

                    } else {
                        client.say(channel, 'Could not convert to ' + requestedCurrency + '. ' + availableCurrencies);
                    }

                } else if (params.length == 5) {

                    // .cur 10 usd in cad
                    var sourceAmount = parseFloat(params[1].replace(',', ''));

                    if (!sourceAmount) {
                        client.say(channel, 'Invalid amount. Usage: ".currency 1 usd to cad" OR ".currency cad" for 1 USD default.');
                        return;
                    }

                    var sourceCurrency = params[2].toUpperCase();
                    var requestedCurrency = params[4].toUpperCase();

                    if (sourceCurrency != 'USD' && !exchangeRates[sourceCurrency]) {
                        client.say(channel, 'Invalid source currency. ' + availableCurrencies);
                        return;
                    }

                    if (requestedCurrency != 'USD' && !exchangeRates[requestedCurrency]) {
                        client.say(channel, 'Invalid target currency. ' + availableCurrencies);
                        return;
                    }

                    // All's good so far, go get the exchange rates

                    fetchCurrency(sourceCurrency).then(function(response) {
                        var fetchedExchangeRates = response['rates'];

                        client.say(channel, sourceAmount + ' ' + sourceCurrency + ' = ' + (parseFloat(fetchedExchangeRates[requestedCurrency]) * sourceAmount).toFixed(2) + ' ' + requestedCurrency);

                    });

                } else {

                    client.say(channel, 'Usage: ".currency 1 usd to cad" OR ".currency cad" for 1 USD default. ' + availableCurrencies)

                }


            });
        }


    });
};
