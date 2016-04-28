/*global chrome, yelpLogoUrl, searchYelp, MutationSummary*/

var GBI_CONTAINER_CLASS = '_OKe';
var GBI_NAME_ATTR = 'title';
var GBI_NAME_CLASS = 'kno-ecr-pt';
var GBI_ADDR_CLASS = '_Xbe';
var GBI_RATINGS_CLASS = '_A8k';
var GBI_SNIPPET_CLASS = '_PJb';
var GBI_REV_ELM1_CLASS = '_B8k';
var GBI_REV_ELM2_CLASS = '_pk _E8k';
var SEPARATOR1_CLASS = 'u-r-p';
var GBI_ONEBOX_CONTAINER_CLASS = '._Db.rl-qs-crs-t';

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
    if(!name) {
      var nameElement = document.getElementsByClassName(GBI_NAME_CLASS)[0];
      name = nameElement.innerHTML.replace(/<.*>/g, '').replace(/&.*;/g, '');
    }
    var addressElement = document.querySelector('[class="' + GBI_ADDR_CLASS + '"]');
    if(!addressElement) {
      return;
    }
    var address = addressElement.innerText;
    yelpifyGoogle(name, address);
  }
};

var yelpifyGoogleOneBox = function(name, address, container) {
  var yelpRatingHTML = 
    '<span class="_PXi yelp-rating">%YELP_RATING%</span>';

  var yelpStarsHTML = 
    '<g-review-stars>' +
      '<img class="yelp-rating-img" src="%YELP_RATING_IMG%" width="69">' +
    '</g-review-stars>';

  var yelpReviewCountHTML = 
    '<span>' + 
      ' (%YELP_REVIEW_CNT%) <img src="' + yelpLogoUrl + '" alt="Yelp" class="yelp-logo">' +
    '</span>';

  searchYelp(name, address, function(business) {
    if(business) {
      var yelpRatingContainer = document.createElement('div');
      
      yelpRatingHTML = yelpRatingHTML.replace(
        '%YELP_RATING%', (+business.rating).toFixed(1).toLocaleString()
      );
      
      yelpStarsHTML = yelpStarsHTML.replace('%YELP_RATING_IMG%', business.rating_img_url_large);
      
      yelpReviewCountHTML = yelpReviewCountHTML.replace(
        '%YELP_REVIEW_CNT%', (+business.review_count).toLocaleString()
      );

      yelpRatingContainer.innerHTML = yelpRatingHTML + yelpStarsHTML + yelpReviewCountHTML;
      container.insertBefore(yelpRatingContainer, container.firstChild.nextSibling);
      container.parentNode.style.height = container.parentNode.clientHeight + 24 + "px";
    }
  });
};

var extractOneBoxNameAndAddress = function(summaries) {
  var summary = summaries[0];
  if(summary.added && summary.added.length) {
    var oneboxResultElements = summary.added;
    for (var i = 0; i < oneboxResultElements.length; i++) {
      var oneboxResultElement = oneboxResultElements[i];
      if(!oneboxResultElement.clientWidth) {
        continue;
      }
      var name = oneboxResultElement.querySelector('[role="heading"]').textContent;
      var nameCityStateArr = oneboxResultElement.querySelectorAll('[data-akp-oq]');
      if(!nameCityStateArr.length) {
        continue;
      }
      var streetCntnr = oneboxResultElement.querySelector('[class="rllt__details"]');
      var street = streetCntnr.children[streetCntnr.children.length - 1].textContent.trim();
      var nameCityState = nameCityStateArr[0].dataset.akpOq;
      var cityState = nameCityState.replace(name, '').trim();
      yelpifyGoogleOneBox(name, street + ' ' + cityState, streetCntnr);
    }
  }
};

/*jshint unused: false*/
chrome.storage.sync.get({
  google: true
}, function(items) {
  if(items.google) {
    var observer = new MutationSummary({
      callback: extractNameAndAddress,
      queries: [{ element: '.' + GBI_ADDR_CLASS }]
    });
    var onebox_observer = new MutationSummary({
      callback: extractOneBoxNameAndAddress,
      queries: [{ element: GBI_ONEBOX_CONTAINER_CLASS }]
    });
  }
});