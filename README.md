# [easyAB](http://srom.github.io/easyAB/)

easyAB is a light-weight jQuery / Zepto plugin for quickly and easily setting up A/B tests using Google Analytics and a cookie-based solution.

## Quick start

```javascript
	// change the color of .my-button for 50% of my visitors and
	// track the users with analytics using a single method!
	$('.my-button').easyab({
	  'name': 'test-button',
	  'default-value': 'green'
	  'alternatives': [
	    {
	      // set an alternative named 'blue'
	      'value': 'blue'
	      'alternative': function($this) { $this.css('background-color', 'blue'); }
	    }
	  ],
	  // set the custom var on the slot 5
	  'slot': 5 
	});
```

See a live example here: [srom.github.io/easyAB/getting-started.html#!dev](http://srom.github.io/easyAB/getting-started.html#!dev)

