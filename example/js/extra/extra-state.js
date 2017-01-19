var aptivator = require('aptivator');
var ExtraView = require('./extra');

aptivator.state('extra', {
  view: ExtraView,
  parentSelector: '.extra'
});
