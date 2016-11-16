var rp = require('request-promise');

module.exports.run = function (client) {

  function jisho_lookup(channel, search_term) {

    var search_url = 'http://jisho.org/api/v1/search/words?keyword=' + encodeURI(search_term);

    rp({
      uri: search_url,
      json: true
    }).then(function(data) {

      if (data.hasOwnProperty("meta") && data.meta.status == 200) {
        if (data.data.length > 0) {
          var result = data.data[0];

          var japanese_word = result["japanese"][0]["word"] === undefined ? '' : 'Word: ' + result["japanese"][0]["word"] + ' - ';
          var japanese_reading = result["japanese"][0]["reading"] === undefined ? '' : 'Reading: ' + result["japanese"][0]["reading"] + ' - ';
          var english_results = result["senses"][0]["english_definitions"] === undefined ? '' : 'Possible definitions: ' + result["senses"][0]["english_definitions"].join(', ');

          client.say(channel, japanese_word + japanese_reading + english_results);
        } else {
          client.say(channel, 'Sorry, no results.');
        }
      } else {
        client.say(channel, 'Sorry, API error during lookup.');
      }
    }).catch(function(err) {
      console.dir(err);
      client.say(channel, "Sorry, error during lookup.");
    });
  }

  client.addListener('message', function(nick, channel, message) {
    params = message.split(' ');

    if (params[0] == '.jisho') {
      if (params.length < 2) {
        client.say(channel, ".jisho <kanji or word to lookup>");
      } else {
        var search_term = message.substr(params[0].length + 1);

        jisho_lookup(channel, search_term);
      }
    }
  });
};