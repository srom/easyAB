# [easyAB](http://srom.github.io/easyAB/)

easyAB is a light-weight jQuery / Zepto plugin for quickly and easily setting up A/B tests using Google Analytics.

## How it works ?

This script sets a cookie containing a seed (i.e a number between 0 and 999) used to choose what version of a given test will be displayed.

## Quick start

	// change the color of .my-button for 50% of my visitors and
	// track the users using analytics using a single method!
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

See a live example here: [srom.github.io/easyAB/getting-started.html#!dev](http://srom.github.io/easyAB/getting-started.html#!dev)<br>
The <i>#!dev</i> markup after the url enable the <strong>development mode</strong>. In dev mode, nothing is tracked and no cookie is setted. Instead, a new seed is generated each time one reload the page enabling developpers to view all possible versions of the page. In addition, information about the tests are logged into the console. Check out your development console and reload the page multiple times!
