/**
 * easyAB.github.io - main.js
 */

(function ($) {
  $(document).ready(function() {

    // make some test with easyAB
    $('#download-btn, #download-btn-reminder').easyab({
      'slot': 1,
      'scope': 2,
      'name': 'download-button-color',
      'default-value': 'apple-green',
      'alternatives': [{
        'value': 'fire-red',
        'alternative': function($this) {
          $this.removeClass('btn-success').addClass('btn-danger');
        }
      }]
    });

    // track page view after setCustomVar when using scope 1 & 2
    window['_gaq'].push(['_trackPageview']);

    // analytics tracking on click
    var downloadRedirection = function() {
      window.location.href = 'http://srom.github.io/easyAB/js/easyab.min.js';
    };
    $('#download-btn a').click(function(event) {
      event.preventDefault();
      window['_gaq'].push(['_trackEvent', 'Download', 'download', 'btn-top']);
      window.setTimeout(downloadRedirection, 500);
    });
    $('#download-btn-reminder a').click(function() {
      event.preventDefault();
      window['_gaq'].push(['_trackEvent', 'Download', 'download', 'btn-reminder']);
      window.setTimeout(downloadRedirection, 500);
    });

  });
})(window.jQuery);