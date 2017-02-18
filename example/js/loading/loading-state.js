var aptivator = require('aptivator');
var LoadingView = require('./loading');

aptivator.state('loading', {
  transient: {
    noResolves: true,
    delay: 100
  },
  animate: {
    enter: {
      root: null
    }
  },
  view: LoadingView,
  parentSelector: '.extra',
  resolves: {
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
