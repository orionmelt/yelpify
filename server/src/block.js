/* jshint node: true */

var blockspring = require('blockspring');
var OAuth = require('oauth');

var YELP_CONSUMER_KEY = '{{tokens.YELP_CONSUMER_KEY}}';
var YELP_CONSUMER_SECRET = '{{tokens.YELP_CONSUMER_SECRET}}';
var YELP_TOKEN = '{{tokens.YELP_TOKEN}}';
var YELP_TOKEN_SECRET = '{{tokens.YELP_TOKEN_SECRET}}';
var YELP_SEARCH_URL = 'https://api.yelp.com/v2/search?term=%NAME%&location=%ADDR%&limit=1';

blockspring.define(function(request, response) {
    var businessName = request.params.businessName;
    var businessAddress = request.params.businessAddress; 

    var oauth = new OAuth.OAuth(
      null,
      null,
      YELP_CONSUMER_KEY,
      YELP_CONSUMER_SECRET,
      '1.0',
      null,
      'HMAC-SHA1'
    );

    YELP_SEARCH_URL = YELP_SEARCH_URL.replace('%NAME%', encodeURIComponent(businessName));
    YELP_SEARCH_URL = YELP_SEARCH_URL.replace('%ADDR%', encodeURIComponent(businessAddress));

    oauth.get(
      YELP_SEARCH_URL,
      YELP_TOKEN,
      YELP_TOKEN_SECRET,
      function (e, data){
        if (e) {
            response.addErrorOutput('UNEXPECTED_ERROR', e);
            response.end();
        } else {
            data = JSON.parse(data);
            if(data.businesses && data.businesses.length) {
                var business = data.businesses[0];
                response.addOutput('business', business);
            } else {
                response.addErrorOutput('NO_RESULTS', 'No results');
            }
            response.end();
        }
      }
    );
});