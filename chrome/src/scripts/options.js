/*global chrome*/

function saveOptions() {
  var sites = ['google', 'grubhub', 'opentable', 'tripadvisor'];
  var options = {};

  sites.forEach(function(site) {
    options[site] = document.getElementById(site).checked;
  });


  chrome.storage.sync.set(options, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved';
    setTimeout(function() {
      status.textContent = '';
    }, 1000);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    google: true,
    grubhub: true,
    opentable: true,
    tripadvisor: true
  }, function(items) {
    for(var site in items) {
      if(items.hasOwnProperty(site)) {
        document.getElementById(site).checked = items[site];
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);