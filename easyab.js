/**
 * easyAB - a jQuery plugin for easier and faster A/B testing.
 */
(function($) {
  
  var _seed;
  var _name;
  var _alternative;
  var _bucket;
  var _dev;
  var _DEV_REGEX = /#!dev/;

  function _getBucket(buckets) {
    var seed;
    if (!_dev) {
      if (!_seed) {
        _seed = _makeSeed();
      }
      seed = _seed;
    } else {
      seed = Math.random() * 999;
    }
    return Math.floor(seed % buckets);
  }

  function _makeSeed() {
    var seed = _readCookie('_easyab_seed');
    if (!seed) {
      seed = Math.random() * 999;
      _setCookie('-_easyab_seed', seed, 30);
    }
    return seed;
  }

  function _setCookie(name,value,days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
  }

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

  function _display($obj) {
    if (_alternative['alternative']) {
      var alternative = _alternative['alternative'];
      if (typeof alternative === 'string') {
        $obj.text(alternative);
      } else if (typeof alternative === 'function') {
        alternative($obj);
      }
    }
  }

  function _trackCustomVar(slot, name, value, options) {
    var scope = options['scope'] || 3;
    window['_gaq'].push(['_setCustomVar',
        slot,
        name,
        value,
        scope
      ]);
  }

  function _trackEvent(category, action, options) {
    var label = options['event-label'] || undefined,
        value = options['event-action'] || undefined,
        noninteraction = ['event-noninteraction'] || true;
    window['_gaq'].push(['_trackEvent',
        category,
        action,
        label,
        value,
        noninteraction
      ]);
  }

  function _log(msg) {
    if (typeof window['console'] !== undefined
      && typeof msg === 'string') {
      return window['console']['log'](msg);
    }
  }

  function _track(options) {
    if (typeof window['_gaq'] !== undefined) {
      var value = '',
          slot = options['slot'];
      if (_bucket !== 0) {
        value = _alternative['value'] || 'alternative' + _bucket;
      } else {
        value = options['default-value'] || 'default';
      }
      if (_dev) {
        if (slot) {
          _log(_name + ' : ' + value + ' (custom var ' + slot + ')');
        } else {
          _log(_name + ' : ' + value + ' (event)');
        }
      } else if (slot) {
        _trackCustomVar(slot, _name, value, options);
      } else {
       _trackEvent(_name, value, options);
      }
    }
  }

  $.fn.easyab = function(options) {
    if (!options || typeof options !== 'object') {
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
  
})(window['jQuery']);
