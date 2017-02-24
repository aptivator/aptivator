require('./about/about-state');
require('./form/form-state');
require('./info/info-state');
require('./error/error-state');
require('./loading/loading-state');

var aptivator = require('aptivator');
var App2View = require('./app-2');

aptivator.state('app-2', {
  route: 'app-2/:one',
  routeValues: [1],
  abstract: true,
  resolves: {
    murmansk: function() {
      return 'murmansk';
    }
  },
  views: {
    '.main': {
      animate: {
        enter: {
          elements: {
            //'h3': 'border-blue'
          }
        }
      },
      view: App2View,
      resolves: {
        random1: {
          resolver: function() {
            console.log('running random1 resolve');
            return Math.random();
          },
          duration: 500,
          store: true
        }
      }
    }
  }
});
