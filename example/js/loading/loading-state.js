var aptivator = require('aptivator');
var LoadingView = require('./loading');

aptivator.state('loading', {
  transient: {
    noResolves: true,
    delay: 100
  },
  cache: false,
  view: LoadingView,
  parentSelector: '.extra',

  data: {
    loadingMessage: 'Loading...'
  }
});
