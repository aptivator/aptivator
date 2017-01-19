var aptivator = require('aptivator');
var LoadingView = require('./loading');

aptivator.state('app-2.loading', {
  transient: {
    keepLast: false,
    delay: 1000
  },
  view: LoadingView,
  parentSelector: '.main',
  data: {
    loadingMessage: 'Loading...'
  },
  resolve: {
    cool: {
      resolver: function() {
        return Promise.resolve('failed...');
      }
    }
  }
});
