var aptivator = require('aptivator');
var ErrorView = require('./error');

aptivator.state('app-2.error', {
  view: ErrorView,
  error: true
});
