var aptivator = require('aptivator');
var LoadingView = require('./loading');

aptivator.state('app-2.loading', {
  transient: {
    keepLast: false,
    delay: 100
  },
  states: ['loading'],
  view: LoadingView,
  parentSelector: '.main',
  data: {
    loadingMessage: 'Loading...'
  },
  resolves: {
    cool: {
      resolver: function() {
        return Promise.resolve('failed...');
      }
    }
  }
});
