var aptivator = require('aptivator');
var LoadingView = require('./loading');

aptivator.state('loading', {
  transient: {
    keepLast: true,
    delay: 100
  },
  view: LoadingView,
  parentRegion: 'extra',
  data: {
    loadingMessage: 'Loading...'
  }
});
