/* easyAB v1.0.2 | (c) 2013 @_srom | srom.github.io/easyAB | MIT @license */

/**
 * easyAB is a light-weight jQuery / Zepto plugin for quickly and easily setting up A/B tests.
 * @see srom.github.io/easyAB
 * @author Romain Strock (Twitter: @_srom)
 * @version v1.0.2
 */
(function($) {

  /**
   * The seed used to select the bucket.
   * @type {number}
   * @private
   */
  var _seed;

  /**
   * The name of the test.
   * @type {string}
   * @private
   */
  var _name;

  /**
   * The selected alternative.
   * @type {string|function}
   * @private
   */
  var _alternative;

  /**
   * The bucket used to select the alternative.
   * @type {number}
   * @private
   */
  var _bucket;

  /**
   * Checks whether we're in dev mode.
   * @type {boolean}
   * @private
   */
  var _dev;

  /**
   * Regex used to set the _dev variable.
   * @type {RegExp}
   * @private
   * @const
   */
  var _DEV_REGEX = /#!dev/;

  /**
   * The name of the cookie that is set.
   * @type {string}
   * @private
   * @const
   */
  var _COOKIE_NAME = '_easyab_seed';

  /**
   * Uses the seed and the number of buckets to choose
   * the bucket value.
   * @param {number} buckets The number of buckets.
   * @return {number} The selected bucket.
   * @private
   */
  function _getBucket(buckets) {
    var seed;
    if (!_dev) {
      // prod mode: gets the existing seed if exists or
      // creates a new seed
      if (!_seed) {
        _seed = _makeSeed();
      }
      seed = _seed;
    } else {
      // dev mode: always pick a new random seed
      seed = Math.random() * 999;
    }
    // returns the bucket number
    return Math.floor(seed % buckets);
  }

  /**
   * Checks if a cookie containing the seed is available. If not, this
   * method generates a random seed and store it in a cookie.
   * @return {number} The seed.
   * @private
   */
  function _makeSeed() {
    var seed = _readCookie(_COOKIE_NAME);
    if (!seed) {
      seed = Math.random() * 999;
      _setCookie(_COOKIE_NAME, seed, 30);
    }
    return seed;
  }

  /**
   * Sets a cookie.
   * @param {string} name The cookie's name.
   * @param {number|string} value The cookie's value.
   * @pram {number} days The expiration time in days.
   * @private
   */
  function _setCookie(name,value,days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
  }

  /**
   * Reads a cookie.
   * @param {string} name The cookie's name.
   * @return {string|number} The cookie's value.
   * @private
   */
  function _readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

  /**
   * Display the alternative.
   * @param {jQuery} $obj The jQuery object.
   * @private
   */
  function _display($obj) {
    if (_alternative['alternative']) {
      var alternative = _alternative['alternative'];
      if (typeof alternative === 'string') {
        // display the text alternative
        $obj.text(alternative);
      } else if (typeof alternative === 'function') {
        // execute the alternative function
        alternative($obj);
      }
    }
  }

  /**
   * Sets a Google Analytics' custom variable.
   * @param {string} slot The slot.
   * @param {string} name The name (or key) of the custom var.
   * @param {string} value The value of the custom var.
   * @param {Object} options Additional options.
   * @private
   */
  function _trackCustomVar(slot, name, value, options) {
    var scope = options['scope'] || 3;
    window['_gaq'].push(['_setCustomVar',
        slot,
        name,
        value,
        scope
      ]);
  }

  /**
   * Sets a Google Analytics' event.
   * Please note that the default value of the event's parameter 'non interaction'
   * is usually false. Here, the default value is true because A/B tests should
   * not affect the bounce rate.
   * @param {string} category The category.
   * @param {string} action The action.
   * @param {Object} options Additional options.
   * @private
   */
  function _trackEvent(category, action, options) {
    var label = options['event-label'] || undefined,
        value = options['event-value'] || undefined,
        noninteraction = ['event-noninteraction'] || true;
    window['_gaq'].push(['_trackEvent',
        category,
        action,
        label,
        value,
        noninteraction
      ]);
  }

  /**
   * Logs a message.
   * @param {string} msg The message that will be logged.
   * @private
   */
  function _log(msg) {
    if (typeof window['console'] !== 'undefined'
      && typeof msg === 'string') {
      return window['console']['log'](msg);
    }
  }

  /**
   * Tracks the test using Google Analytics.
   * @param {Object} options The options.
   * @private
   */
  function _track(options) {
    // checks if the GA variable has been initialised
    if (typeof window['_gaq'] !== 'undefined') {
      var value = '',
          slot = options['slot'];
      if (_bucket !== 0) {
        // alternative
        value = _alternative['value'] || 'alternative' + _bucket;
      } else {
        // default
        value = options['default-value'] || 'default';
      }
      if (_dev) {
        // dev mode: only logs the information about the events or custom vars
        if (slot) {
          _log(_name + ' : ' + value + ' (custom var ' + slot + ')');
        } else {
          _log(_name + ' : ' + value + ' (event)');
        }
      } else if (slot) {
        // tracks a custom variable if a slot has been specified
        _trackCustomVar(slot, _name, value, options);
      } else {
        // tracks an event
       _trackEvent(_name, value, options);
      }
    }
  }

  /**
   * easyAB plugin definition.
   * @param {Object} options The options.
   */
  $.fn.easyab = function(options) {
    if (!options
        || typeof options !== 'object'
        || !navigator.cookieEnabled) {
      return this;
    } else {
      _name = options['name'];
      if (_name && options['alternatives']) {
          _dev = _DEV_REGEX.test(window.location);
          _bucket = _getBucket(options['alternatives'].length + 1);
          if (_bucket !== 0) {
            _alternative = options['alternatives'][_bucket - 1];
          }
          _track(options);
      }
      return this.each(function() {
        var $this = $(this);
        if (_bucket !== 0) {
          _display($this);
        }
      });
    }
  };
// works both with Zepto and jQuery !
})(window['jQuery'] || window['Zepto']);
