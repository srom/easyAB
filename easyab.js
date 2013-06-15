/**
 * easyAB - a jQuery plugin for easier and faster A/B testing.
 */
(function($) {
  
  var _seed;
  var _name;
  var _alternatives;
  var _currentBucket;

  function _getBucket(buckets) {
    if (!_seed) {
      _seed = _makeSeed();
    }
    return Math.floor(_seed % buckets);
  }

  function _makeSeed() {
    var seed = _readCookie('jquery_easyab_seed');
    if (!seed) {
      seed = Math.random() * 999;
      _setCookie('jquery_easyab_seed', seed, 30);
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
    console.log(_currentBucket);
    if (_currentBucket !== 0) {
      var alternative = _alternatives[_currentBucket - 1];
      if (typeof alternative === 'string') {
        $obj.text(alternative);
      } else if (typeof alternative === 'function') {
        alternative($obj);
      }
    }
  }

  $.fn.easyab = function(options) {
    if (!options || typeof options != 'object') {
      return this;
    } else {
      return this.each(function() {
        var $this = $(this);
        _name = options['name'];
        _alternatives = options['alternatives'];
        if (_name && _alternatives) {
          _currentBucket = _getBucket(_alternatives.length + 1);
          _display($this);
        }
      });
    }
  };
  
})(window['jQuery']);

/**
 * Main closure.
 */
(function($) {
  $(document).ready(function() {
    
    $('#1').easyab({
      name: 'easy-test',
      alternatives: ["Salut!", "Hey!!"]
    });

    $('#2').easyab({
      name: 'easy-test-function',
      alternatives: [function($this) { $this.css('background-color', 'blue'); }]
    });
    
  });
})(window['jQuery']);
