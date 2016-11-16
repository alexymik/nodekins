md5 = require('js-md5');

module.exports.run = function (client) {

  function get_8ball_answers(number) {

    answers = [];
    answers[0] = "It is certain";
    answers[1] = "It is decidedly so";
    answers[2] = "Without a doubt";
    answers[3] = "Yes; definitely";
    answers[4] = "You may rely on it";
    answers[5] = "As I see it; yes";
    answers[6] = "Most likely";
    answers[7] = "Outlook good";
    answers[8] = "Yes";
    answers[9] = "Signs point to yes";
    answers[10] = "Reply hazy try again";
    answers[11] = "Ask again later";
    answers[12] = "Better not tell you now";
    answers[13] = "Cannot predict now";
    answers[14] = "Concentrate and ask again";
    answers[15] = "Don't count on it";
    answers[16] = "My reply is no";
    answers[17] = "My sources say no";
    answers[18] = "Outlook not so good";
    answers[19] = "Very doubtful";

    return(answers[number]);
  }

  function convert_md5_to_answer(md5hash) {
    //Get the first two integer occurrences in the md5 hash, then convert to a number 0-19
    //This way each question gets the same answer

    hash_integers = md5hash.match(/\d/g);
    first_integer = parseInt(hash_integers[0]) % 2;
    second_integer = parseInt(hash_integers[1]);

    if (first_integer == 0) {
      return second_integer;
    } else {
      return second_integer + 10
    }
  }

  client.addListener('message', function(nick, channel, message) {
    params = message.split(' ');

    if (params[0] == '.8ball') {
      if (params.length < 2) {
        client.say(channel, '.8ball <your question>');
      } else {
        question = message.substr(params[0].length + 1);
        question_md5 = md5(question);

        client.say(channel, get_8ball_answers(convert_md5_to_answer(question_md5)));
      }
    }

  });
};
