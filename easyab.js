/**
 * easyAB - a jQuery plugin for easier and faster A/B testing.
 */
(function($) {
  
  var _seed = Math.random() * 999;
  var _variables = {};
  var _views = [];
  var _name;
  var _alternatives;
  var _currentBucket;
  var _currentView = 0;
  var _DEFAULT_VALUE = '__easyab__default';

  function _getBucket(buckets) {
    return Math.floor(_seed % buckets);
  }

  function _updateViews() {
    if (_views.length > 0) {
      // update existing views
      var tmpViews = [];
      var tmpCurrentView = _currentView;
      var countViews = 0;
      while (_views.length > 0) {
        countViews++;
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
          if (countViews === tmpCurrentView && ialt === _currentBucket) {
            _currentView = countViews * (ialt + 1);
          }
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
    var alternatives = _views[_currentView - 1];
    var alternative = alternatives[alternatives.length - 1][_name];
    if (alternative !== _DEFAULT_VALUE) {
      if (typeof alternative == 'string') {
        $obj.text(alternative);
      } else if (typeof alternative == 'function') {
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
          if (_currentView === 0) {
            _currentView = _currentBucket + 1;
          }
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
