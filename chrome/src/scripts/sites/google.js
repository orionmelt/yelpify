/*global chrome, yelpLogoUrl, searchYelp, MutationSummary*/

var GBI_CONTAINER_CLASS = '_OKe';
var GBI_NAME_ATTR = 'title';
var GBI_ADDR_ATTR = 'address';
var GBI_NAME_CLASS = 'kno-ecr-pt';
var GBI_ADDR_CLASS = '_Xbe';
var GBI_RATINGS_CLASS = '_A8k';
var GBI_SNIPPET_CLASS = '_PJb';
var GBI_REV_ELM1_CLASS = '_B8k';
var GBI_REV_ELM2_CLASS = '_pk _E8k';
var SEPARATOR1_CLASS = 'u-r-p';

function yelpifyGoogle(name, address) {
  var yelpRatingHTML = 
    '<span class="rtng yelp-rating" aria-hidden="true">%YELP_RATING%</span>';

  var yelpStarsHTML = 
    '<g-review-stars>' +
      '<img class="yelp-rating-img" src="%YELP_RATING_IMG%" width="69">' +
    '</g-review-stars>';

  var yelpLinkHTML = 
    '<span class="yelp-link">' + 
      '<a href="%YELP_URL%">%YELP_REVIEW_CNT% Yelp reviews</a>' +
    '</span>';

  var yelpHeaderHTML = 
    'Yelp reviews <img src="' + yelpLogoUrl + '" alt="Yelp" class="yelp-logo">';

  var yelpSnippetHTML = 
    '<div class="_OJb">' + 
      '<img class="yelp-snippet-img" src="%YELP_SNIPPET_IMG%" alt="Yelp reviewer">' + 
    '</div>' + 
    '<div class="_RJb">%YELP_SNIPPET_TEXT%</div>';

  var yelpMoreReviewsHTML = 
    '<span class="_bYi">' + 
      '<a href="%YELP_URL%"><span>View all Yelp reviews</span></a>' + 
    '</span>';

  var gbiContainer = document.getElementsByClassName(GBI_CONTAINER_CLASS)[0];  
  var ratingsContainer = gbiContainer.getElementsByClassName(GBI_RATINGS_CLASS)[0];

  searchYelp(name, address, function(business) {    
    if(business) {
      var yelpRatingContainer = document.createElement('div');
      yelpRatingContainer.setAttribute('class', 'yelp-rating-container');

      yelpRatingHTML = yelpRatingHTML.replace(
        '%YELP_RATING%', (+business.rating).toFixed(1).toLocaleString()
      );
      yelpStarsHTML = yelpStarsHTML.replace('%YELP_RATING_IMG%', business.rating_img_url_large);
      yelpLinkHTML = yelpLinkHTML.replace('%YELP_URL%', business.url);
      yelpLinkHTML = yelpLinkHTML.replace(
        '%YELP_REVIEW_CNT%', (+business.review_count).toLocaleString()
      );

      yelpRatingContainer.innerHTML = yelpRatingHTML + yelpStarsHTML + yelpLinkHTML;

      if(ratingsContainer) {
        ratingsContainer.appendChild(yelpRatingContainer);    
      } else {
        var businessNameElement = document.getElementsByClassName(GBI_NAME_CLASS)[0];
        var descElement = businessNameElement.parentNode.parentNode.nextSibling;
        var modElement = document.createElement('div');
        modElement.setAttribute('class', 'mod');
        modElement.appendChild(yelpRatingContainer);
        descElement.parentNode.insertBefore(modElement, descElement);
      }
      
      var gReviewsElement1 = document.getElementsByClassName(GBI_REV_ELM1_CLASS)[0];

      var yelpSnippetText = business.snippet_text;
      var yelpSnippetImageUrl = business.snippet_image_url;
      
      var yelpHeaderElement = document.createElement('div');
      yelpHeaderElement.setAttribute('class', GBI_REV_ELM1_CLASS);
      yelpHeaderElement.innerHTML = yelpHeaderHTML;

      var yelpSnippetElement = document.createElement('div');
      yelpSnippetElement.setAttribute('class', GBI_SNIPPET_CLASS + ' yelp-snippet');

      yelpSnippetHTML = yelpSnippetHTML.replace('%YELP_SNIPPET_IMG%', yelpSnippetImageUrl);
      yelpSnippetHTML = yelpSnippetHTML.replace('%YELP_SNIPPET_TEXT%', yelpSnippetText);
      yelpSnippetElement.innerHTML = yelpSnippetHTML;

      var separator1 = document.createElement('div');
      separator1.setAttribute('class', SEPARATOR1_CLASS);

      var separator2 = document.createElement('div');
      separator2.style.clear = 'both';
      
      if(gReviewsElement1) {
        gReviewsElement1.parentNode.appendChild(yelpHeaderElement);    
      } else {
        var gReviewsElement2 = document.getElementsByClassName(GBI_REV_ELM2_CLASS)[0];
        yelpHeaderElement.setAttribute('class', GBI_REV_ELM2_CLASS);
        gReviewsElement2.parentNode.appendChild(yelpHeaderElement);
        separator2.style.marginTop = '10px';
      }
      
      yelpHeaderElement.parentNode.appendChild(yelpSnippetElement);
      yelpHeaderElement.parentNode.appendChild(separator1);
      yelpHeaderElement.parentNode.appendChild(separator2);

      var yelpMoreReviewsElement = document.createElement('span');
      yelpMoreReviewsHTML = yelpMoreReviewsHTML.replace('%YELP_URL%', business.url);
      yelpMoreReviewsElement.innerHTML = yelpMoreReviewsHTML;

      yelpHeaderElement.parentNode.appendChild(yelpMoreReviewsElement);
    }
  });
}

var extractNameAndAddress = function(summaries) {
  var summary = summaries[0];
  if(summary.added && summary.added.length) {
    var name = summary.added[0].dataset[GBI_NAME_ATTR];
    var address = document.querySelector('[class="' + GBI_ADDR_CLASS + '"]').innerText;
    yelpifyGoogle(name, address);
  }
};

/*jshint unused: false*/
chrome.storage.sync.get({
  google: true
}, function(items) {
  if(items.google) {
    var observer = new MutationSummary({
      callback: extractNameAndAddress,
      queries: [{ attribute: 'data-' + GBI_ADDR_ATTR }]
    });
  }
});