var aptivator = require('aptivator');
var LoadingView = require('./loading');

aptivator.state('loading', {
  transient: true,
  view: LoadingView,
  parentRegion: 'extra',
  data: {
    loadingMessage: 'Loading...'
  }
});
