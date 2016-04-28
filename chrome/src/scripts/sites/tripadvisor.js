/*global chrome, yelpLogoUrl, searchYelp, MutationSummary*/

var TA_RATINGS_CONTAINER_CLASS = 'heading_rating separator';
var TA_CONTAINER_PROP = 'aggregateRating';
var TA_ADDR_CLASS = 'format_address';

function yelpifyTripAdvisor(name, address) {
  var yelpRatingsHTML = 
    '<div class="rs rating">' +
      '<span class="yelp-rating-container">' + 
        '<img src="%YELP_RATING_IMG%" width="90" class="yelp-rating">' +
      '</span>' + 
      '<a class="more" href="%YELP_URL%">' + 
        '%YELP_REVIEW_CNT% reviews' +
      '</a>' +
      '<img src="' + yelpLogoUrl + '" class="yelp-logo">' +
    '</div>';

  searchYelp(name, address, function(business) {    
    if(business) {
      var taRatingsContainer = document.querySelector(
        '[property="' + TA_CONTAINER_PROP + '"]'
      ).parentNode;
      var yelpRatingsContainer = document.createElement('div');
      yelpRatingsContainer.setAttribute('class', TA_RATINGS_CONTAINER_CLASS);
      
      yelpRatingsHTML = yelpRatingsHTML.replace('%YELP_RATING_IMG%', business.rating_img_url_large);
      yelpRatingsHTML = yelpRatingsHTML.replace(
        '%YELP_REVIEW_CNT%', (+business.review_count).toLocaleString()
      );
      yelpRatingsHTML = yelpRatingsHTML.replace('%YELP_URL%', business.url);
      yelpRatingsContainer.innerHTML = yelpRatingsHTML;
      
      taRatingsContainer.parentNode.insertBefore(
        yelpRatingsContainer, taRatingsContainer.nextSibling
      );
    }
  });
}

var extractNameAndAddress = function(summaries) {
  var summary = summaries[0];
  summary.added.forEach(function(addrElement) {
    var parent = addrElement.parentNode;
    var grandparent = parent.parentNode;
    if(!(grandparent.tagName.toLowerCase() === 'address' || 
         parent.tagName.toLowerCase() === 'address')) {
      return;
    }
    var name = document.querySelector('[property="name"]').textContent.trim();
    var address = addrElement.textContent.trim();
    yelpifyTripAdvisor(name, address);
  });
};

/*jshint unused: false*/
chrome.storage.sync.get({
  tripadvisor: true
}, function(items) {
  if(items.tripadvisor) {
    var observer = new MutationSummary({
      callback: extractNameAndAddress,
      queries: [{ element: 'span.' + TA_ADDR_CLASS }]
    });
  }
});