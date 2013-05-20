/**
 * easyAB - a jQuery plugin for easier and faster A/B testing.
 */
(function($) {
  
  var _seed = Math.random() * 999;
  var _variables = {};
  var _views = [];
  var _name;
  var _alternatives;

  function _getBucket(buckets) {
    return Math.floor(_seed % buckets);
  }

  function _addVariable(options) {
    _variables[_name] = _alternatives;
    if (_views.length > 0) {
      var tmpViews = _views;
      for (var index in _views) {
        for (var i = 0 ; i <= _alternatives.length ; i++) {
          var o = {};
          o[_name] = i;
          tmpViews[index].push(o);
        }
      }
      _views = tmpViews;
    } else {
      for (var i = 0 ; i <= _alternatives.length ; i++) {
        var tab = [];
        var o = {};
        o[_name] = i;
        tab.push(o);
        _views.push(tab);
      }
    }
    console.log(_views);
  }

  function _display($obj) {
    var bucket = _getBucket(_views.length);
    console.log('bucket: '  + bucket);
    var value = _views[bucket];
    var val = value[value.length - 1][_name];
    console.log('val: ' + val);
    if (val > 0) {
      $obj.text(_alternatives[val-1]);
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
      name: 'easy-test2',
      alternatives: ["ah ah ah!"]
    });
    
  });
})(window['jQuery']);
