var moment = require('moment');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localStorage');

module.exports.run = function (client) {

  var tells = JSON.parse(localStorage.getItem('tells'));

  if (!tells) {
    tells = {};
  }

  client.addListener('message', function(nick, channel, message) {
    params = message.split(' ');

    if (params[0] == '.tell') {
      if (params.length < 3) {
        client.say(channel, '.tell <nick> <message>');
      } else {
        if (!tells.hasOwnProperty(params[1])) {
          tells[params[1]] = [];
        }

        tells[params[1]].push({
          'nick': nick,
          'message': message.substr(params[0].length + params[1].length + 2),
          'date': moment()
        });

        localStorage.setItem('tells', JSON.stringify(tells));
        client.say(channel, 'OK, I will tell ' + params[1] + ' the next time I see them.')
      }
    }

    if (tells.hasOwnProperty(nick)) {
      tells[nick].forEach(function(element, index, array) {
        client.say(channel, nick + ' - ' + element.nick + ' left you a message ' + element.date.fromNow() + ': ' + element.message);
      });
      delete tells[nick];
      localStorage.setItem('tells', JSON.stringify(tells));
    }
  });
};
