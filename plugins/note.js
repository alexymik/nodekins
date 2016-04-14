var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localStorage');

var fuzzy = require('fuzzy');

/**
 * @param client
 *
 * Note plugin
 *
 * Depends on local storage
 *
 * Basic overview: creates and retrieves simple notes based on JSON keys
 *
 * Usage:
 *      .note
 *      > .note name (your message here)
 *
 *      .note something
 *      > Note not found, create one using: .note name (your message here)
 *
 *      .note something my note here
 *      > Saved
 *
 *      .note something
 *      > something: my note here
 */

module.exports.run = function (client) {

    // Get stored list of args
    var notes = JSON.parse(localStorage.getItem('notes'));

    // Default object
    if (!notes) {
        notes = {};
    }

    function getFuzzyMatches(searchTerm) {

        var matches = [];

        // Do a fuzzy search for other potential notes
        fuzzy.filter(searchTerm, Object.keys(notes)).map(function(value) {
            if (value.string != searchTerm) {
                matches.push(value.string);
            }
        });

        // Only return 10 results
        return matches.slice(0, 10);
    }

    client.addListener('message', function(nick, channel, message) {
        var params = message.split(' ');

        if (params[0] == '.note') {

            // Check for proper amount of args, proper args
            if (params.length < 2 || params[1] == '') {
                client.say(channel, '.note name (your message here)');
                return
            }

            // Convert all keys to lowercase to avoid confusion
            params[1] = params[1].toLowerCase();

if (params[1] && params[2]) {
                note = message.substr(params[0].length + params[1].length + 2);

                old_note = notes[params[1]];

                if (!old_note) {
                    notes[params[1]] = note;
                    localStorage.setItem('notes', JSON.stringify(notes));
                    client.say(channel, 'Saved note for: ' + params[1]);
                } else {
                    client.say(channel, 'A note for ' + params[1] + ' already exists: ' + old_note);
                    client.say(channel, 'Confirm overwrite with .yes');

                    var callback = function(sameNick, sameChannel, response) {

                        var note_to_save = note;
                        var key = params[1];

                        // Don't allow others to confirm, or confirm from another channel
                        if (response.substr(0, 4) == '.yes' && nick == sameNick && channel == sameChannel) {
                            notes[key] = note_to_save;

                            localStorage.setItem('notes', JSON.stringify(notes));

                            client.say(channel, 'Saved note for: ' + params[1]);

                            stopListening();

                        }
                    };

                    client.addListener('message', callback);

                    var stopListening = function() {
                        client.removeListener('message', callback);
                    };

                    // Remove the listener for .yes or .no overwrite confirmation after 30 seconds
                    // Just in case no confirmation is given
                    setTimeout(function() {
                        stopListening();
                    }, 30000);
                }

                return;
            }

            // Check if key exists
            if (notes[params[1]]) {

                client.say(channel, params[1] + ': ' + notes[params[1]]);

                var searchTerm = params[1].replace(/\d/g, '');
                var matches = getFuzzyMatches(searchTerm);

                if (matches.length > 0) {
                    client.say(channel, 'See also: ' + matches.join(' '));
                } 

            } else {

                var matches = getFuzzyMatches(params[1]);

                if (matches.length > 0) {
                    client.say(channel, 'Not found. Did you mean: ' + matches.join(' '));
                } else {
                    client.say(channel, 'Not found. Create a note with ".note name (your message here)"');
                }
            }
        }
    });
};

