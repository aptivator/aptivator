var aptivator = require('aptivator');
var LoadingView = require('./loading');

aptivator.state('loading', {
  transient: {
    keepLast: false,
    noResolves: true,
    delay: 100
  },
  view: LoadingView,
  parentSelector: '.extra',
  resolve: {
    delayer: {
      resolver: function() {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve('resolved');
          }, 1000);
        });
      }
    }
  },
  data: {
    loadingMessage: 'Loading...'
  }
});
