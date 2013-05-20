/**
 * easyAB - a jQuery plugin for easier and faster A/B testing.
 */
(function($) {
  
  var _seed = Math.random() * 999;
  var _variables = {};
  var _views = [];
  var _name;
  var _alternatives;
  var _DEFAULT_VALUE = '__easyab__default';

  function _getBucket(buckets) {
    return Math.floor(_seed % buckets);
  }

  function _updateViews() {
    if (_views.length > 0) {
      // update existing views
      var tmpViews = [];
      while (_views.length > 0) {
        var view = _views.shift();
        for (var ialt = 0 ; ialt <= _alternatives.length ; ialt++) {
          var viewCopy = view.slice(0);
          var o = {};
          if (ialt == 0) {
            o[_name] = _DEFAULT_VALUE;
          } else {
            o[_name] = _alternatives[ialt - 1];
          }
          viewCopy.push(o);
          tmpViews.push(viewCopy);
        }
      }
      _views = tmpViews;
    } else {
      // create first views
      for (var i = 0 ; i <= _alternatives.length ; i++) {
        var tab = [];
        var o = {};
        if (i == 0) {
          o[_name] = _DEFAULT_VALUE;
        } else {
          o[_name] = _alternatives[i-1];
        }
        tab.push(o);
        _views.push(tab);
      }
    }
  }

  function _addVariable(options) {
    _variables[_name] = _alternatives;
  }

  function _display($obj) {
    var bucket = _getBucket(_alternatives.length + 1);
    if (bucket > 0) {
      var alt = _alternatives[bucket-1];
      if (typeof alt == 'string') {
        $obj.text(alt);
      } else if (typeof alt == 'function') {
        alt($obj);
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
          _addVariable(options);
          _updateViews();
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
