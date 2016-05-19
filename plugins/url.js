var MetaInspector = require('node-metainspector');
var rp = require('request-promise');

module.exports.run = function (client) {

    isImage = function(url) {

        if (/(https?:\/\/.*\.(?:png|jpg))/i.exec(url)) {
            return true
        } else {
            return false
        }
    }

    if (config["youtube-api-key"] === undefined) { 
    	console.log('No Youtube API key, not loading additional Youtube data from urls.')
    	
    	client.addListener('message', function (nick, channel, message) {
          checkUrlAndSendMessage(channel, message);  
	});

    } else {
    	client.addListener('message', function (nick, channel, message) {
        	var youtubeVideoID = getYoutubeVideoID(message);

       		if (youtubeVideoID != false) {
	 		getYoutubeVideoInfo(channel, youtubeVideoID)
		} else {
          		checkUrlAndSendMessage(channel, message);  
		}
	 });
    }

    getYoutubeVideoInfo = function(to, youtubeVideoID) {
        rp.get('https://www.googleapis.com/youtube/v3/videos?id=' + youtubeVideoID + '&key=' + config["youtube-api-key"] + '&fields=items(id,snippet(channelTitle,title,categoryId),statistics)&part=snippet,statistics')
        .then(function(reply) {

            jsonReply = JSON.parse(reply);
            
            videoObject = jsonReply.items[0];
            videoTitle = videoObject.snippet.title;
            videoUploader = videoObject.snippet.channelTitle;
            videoViews = videoObject.statistics.viewCount;
            videoLikes = videoObject.statistics.likeCount;
            videoDislikes = videoObject.statistics.dislikeCount;
            
            videoViewsFmt = videoViews.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            videoLikesFmt = videoLikes.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            videoDislikesFmt = videoDislikes.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            
            client.say(to, videoTitle + ' - Uploaded by: ' + videoUploader + ' - Views: ' + videoViewsFmt + ' - Likes/Dislikes: (' + videoLikesFmt + '/' + videoDislikesFmt + ')');

        });
    }

    getYoutubeVideoID = function(url) {
        var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match && match[1].length==11)? match[1] : false;
    }

    checkUrlAndSendMessage = function(to, message) {
        var params = message.split(' ');

        params.forEach(function (param) {
            if (param.toLowerCase() != 'ai' && param.toLowerCase() != 'dk') {

                if (!isImage(param)) {

                    var meta = new MetaInspector(param, {limit: 3000000});

                    meta.on('fetch', function () {
                        if (meta.title) {
                            client.say(to, meta.title.trim().replace(/(\r\n|\n|\r)/gm, ' '));
                            this.removeAllListeners();
                        } else {

                        }
                    });

                    meta.on("error", function (err) {
                        this.removeAllListeners();
                    });

                    meta.fetch();
                }

            }
        });
    }
};
  
