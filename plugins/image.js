var rp = require('request-promise');
var sleep = require('sleep');

module.exports.run = function (client) {
    
    if (config["camfind-api-key"] === undefined) { 
        console.log('No Camfind API key set. Not loading image plugin.');
        return;
    }

    isImage = function(url) {
        return /(https?:\/\/.*\.(?:png|jpg))/i.exec(url);
    }

    submitReverseImageLookup = function(url) {
        return rp({
            method: 'post',
            uri: 'https://camfind.p.mashape.com/image_requests',
            form: {
                'image_request[locale]': 'en_US',
                'image_request[remote_image_url]': url
            },
            headers: {
                'X-Mashape-Key': config["camfind-api-key"]
            },
            json: true
        });
    }

    getReverseImageLookupResult = function(token, image_url, client, channel, count) {
        return rp({
            method: 'get',
            uri: 'https://camfind.p.mashape.com/image_responses/' + token,
            headers: {
                'X-Mashape-Key': config["camfind-api-key"]
            },
            json: true
        }).then(function(reply) {
            console.log(reply);

            count++;

            if (count >= 50) { return }

            if (reply.name) {
                client.say(channel, image_url + ' - guess for this image: '+ reply.name)
            } else {
                sleep.sleep(2);
                getReverseImageLookupResult(token, image_url, client, channel);
            }

        });
    }

    client.addListener('message', function(nick, channel, message) {
        var params = message.split(' ');

        if (params[0] == '.image') {

            // Check for proper amount of args, proper args
            if (params.length < 2 || params[1] == '') {
                client.say(channel, '.image (url of image to do reverse image analysis on)');
                return
            }

            if (isImage(params[1])) {

            	client.say(channel, "OK, I'll do my best!");

                submitReverseImageLookup(params[1]).then(function(submission_result) {
                    console.log(submission_result);
                    getReverseImageLookupResult(submission_result.token, params[1], client, channel, 1);
                });
            }
        }            
    });

};
