/*global chrome, yelpLogoUrl, searchYelp, MutationSummary*/

var OT_CONTAINER_PROP = 'aggregateRating';

function yelpifyOpenTable(name, address) {
  var yelpRatingsHTML = 
    '<div class="star-rating">' +
      '<div class="star-wrapper">' +
        '<img src="%YELP_RATING_IMG%" width="110" class="yelp-rating">' + 
      '</div>' +
      '<span class="star-rating-text">' +
        '<a class="js-smooth-scroll transparent" href="%YELP_URL%">' + 
          '%YELP_REVIEW_CNT% reviews' +
        '</a>' +
        '<img src="' + yelpLogoUrl + '" class="yelp-logo">' +
      '</span>' +
    '</div>';
  
  searchYelp(name, address, function(business) {    
    if(business) {
      var otRatingsContainer = document.querySelector('[itemprop="' +  OT_CONTAINER_PROP + '"]');
      
      yelpRatingsHTML = yelpRatingsHTML.replace('%YELP_RATING_IMG%', business.rating_img_url_large);
      yelpRatingsHTML = yelpRatingsHTML.replace('%YELP_REVIEW_CNT%', (+business.review_count));
      yelpRatingsHTML = yelpRatingsHTML.replace('%YELP_URL%', business.url);
      var yelpRatingsContainer = document.createElement('div');
      yelpRatingsContainer.innerHTML = yelpRatingsHTML;

      otRatingsContainer.parentNode.insertBefore(
        yelpRatingsContainer, otRatingsContainer.nextSibling
      );
    }
  });
}

var extractNameAndAddress = function(summaries) {
  var summary = summaries[0];
  summary.added.forEach(function(addrElement) {
    if(addrElement.getAttribute('itemprop') === 'streetAddress') {
      var nameElement = document.querySelector('[class="page-header-title"]');
      var name = nameElement.textContent.trim();
      var address = addrElement.textContent.trim();

      yelpifyOpenTable(name, address);
    }
  });
};

/*jshint unused: false*/
chrome.storage.sync.get({
  opentable: true
}, function(items) {
  if(items.opentable) {
    var observer = new MutationSummary({
      callback: extractNameAndAddress,
      queries: [{ attribute: 'itemprop' }]
    });
  }
});