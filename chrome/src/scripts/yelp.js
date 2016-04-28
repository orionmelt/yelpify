/*global chrome*/
/*exported yelpLogoUrl, searchYelp*/

var BLOCK_ID = '{{tokens.BLOCK_ID}}';
var BLOCKSPRING_KEY = '{{tokens.BLOCKSPRING_KEY}}';
var BLOCKSPRING_URL = 
  'https://run.blockspring.com/api_v2/blocks/%BLOCK_ID%?api_key=%BLOCKSPRING_KEY%&cached=true';

BLOCKSPRING_URL = BLOCKSPRING_URL.replace('%BLOCK_ID%', BLOCK_ID);
BLOCKSPRING_URL = BLOCKSPRING_URL.replace('%BLOCKSPRING_KEY%', BLOCKSPRING_KEY);

var yelpLogoUrl = chrome.extension.getURL('images/yelp.png');
var cache = {};

function searchYelp(name, address, callback) {
  if(!name || !address) {
    return;
  }
  var cache_key = name.replace(/[\.\,\s]/g, '') + address.replace(/[\.\,\s]/g, '').substr(0, 15);
  if(cache[cache_key]) {
    callback(cache[cache_key]);
  } else {
    var xhr = new XMLHttpRequest();
    var params = JSON.stringify({
      businessName: name.trim().replace('\n',' '),
      businessAddress: address.trim().replace('\n',' ')
    });
    xhr.onreadystatechange = function() {
      if(xhr.readyState === 4) {
        var results = JSON.parse(xhr.responseText);
        var business = null;
        if(results && !results._errors.length && results.business) {
          business = results.business;
        }
        cache[cache_key] = business;
        callback(business);
      }
    };
    xhr.open('POST', BLOCKSPRING_URL, true);
    xhr.send(params);
  }
}