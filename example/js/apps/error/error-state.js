var aptivator = require('aptivator');
var ErrorView = require('./error');

aptivator.state('error', {
  route: 'error',
  view: ErrorView,
  parentRegion: 'error'
});
