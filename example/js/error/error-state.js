var aptivator = require('aptivator');
var ErrorView = require('./error');

aptivator.state('error', {
  view: ErrorView,
  parentSelector: '.error',
  error: true
});
