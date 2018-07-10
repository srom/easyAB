# ⚠️ This project is no longer maintained ⚠️

easyAB is a light-weight (< 2 Ko) jQuery plugin for easily setting up A/B and multivariate tests using Google Analytics.

This tool aims at helping entrepreneurs and tech savvy people building better landing pages for their projects and products.

## Quick start

```javascript
// change the color of .my-button for 50% of my visitors and
// track the users with analytics using a single method!
$('.my-button').easyab({
  'slot': 5, // set the custom var on the slot 5
  'name': 'test-button',
  'default-value': 'green',
  'alternatives': [
    {
      // set an alternative
      'value': 'blue',
      'alternative': function($this) { $this.css('background-color', 'blue'); }
    }
  ],
});
```

## License

Copyright 2013 [Romain Strock](https://twitter.com/romainstrock) - [MIT License](https://github.com/srom/easyAB/blob/master/LICENSE)
