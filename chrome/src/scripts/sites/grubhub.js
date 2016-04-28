/*global chrome, yelpLogoUrl, searchYelp, MutationSummary*/

var GH_RATINGS_CONTAINER_CLASS = 'restaurantHeader-secondaryInfo--rankings';

function yelpifyGrubHub(name, address) {
  var yelpRatingsHTML = 
    '<span class="r-star-rating">' +
      '<span class="rating">' +
        '<span class="rating-stars">' +
          '<img src="%YELP_RATING_IMG%" width="90" class="yelp-rating">' + 
          '<span class="caption type-secondary">' +
            '<a class="s-link-light" href="%YELP_URL%">' + 
              '%YELP_REVIEW_CNT% reviews' +
            '</a>' +
            '<img src="' + yelpLogoUrl + '" class="yelp-logo">' +
          '</span>' +
        '</span>' +
      '</span>' +
    '</span>';

  searchYelp(name, address, function(business) {    
    if(business) {
      var ghRatingsContainer = document.getElementsByClassName(GH_RATINGS_CONTAINER_CLASS)[0];

      var yelpRatingsContainer = document.createElement('div');
      yelpRatingsContainer.setAttribute('class', GH_RATINGS_CONTAINER_CLASS + ' yelp-container');
      

      yelpRatingsHTML = yelpRatingsHTML.replace('%YELP_RATING_IMG%', business.rating_img_url_large);
      yelpRatingsHTML = yelpRatingsHTML.replace(
        '%YELP_REVIEW_CNT%', (+business.review_count).toLocaleString()
      );
      yelpRatingsHTML = yelpRatingsHTML.replace('%YELP_URL%', business.url);
      yelpRatingsContainer.innerHTML = yelpRatingsHTML;

      ghRatingsContainer.parentNode.insertBefore(
        yelpRatingsContainer, ghRatingsContainer.nextSibling
      );
    }
  });
}

var extractNameAndAddress = function(summaries) {
  var summary = summaries[0];
  summary.added.forEach(function(nameElement) {
    if(nameElement.getAttribute('itemprop') === 'name') {
      var name = nameElement.textContent.trim();

      name = name.replace(/Menu$/gi, '');
      name = name.replace(/\(.*\)/gi, '');
      name = name.replace(/\#\d+/gi, '');

      var streetAddr = document.querySelector('[itemprop="streetAddress"]').textContent.trim();
      var addrLocality = document.querySelector('[itemprop="addressLocality"]').textContent.trim();
      var addrRegion = document.querySelector('[itemprop="addressRegion"]').textContent.trim();
      var postalCode = document.querySelector('[itemprop="postalCode"]').textContent.trim();
      var address = streetAddr + ' ' + addrLocality + ' ' + addrRegion + ' ' + postalCode;
      
      yelpifyGrubHub(name, address);
    }
  });
};

/*jshint unused: false*/
chrome.storage.sync.get({
  grubhub: true
}, function(items) {
  if(items.grubhub) {
    var observer = new MutationSummary({
      callback: extractNameAndAddress,
      queries: [{ attribute: 'itemprop' }]
    });
  }
});