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
  //states: ['app-2.about'],
  //multiples: ['main'],
  resolve: {
    murmansk: function() {
      return 'murmansk';
    }
  },
  views: {
    main: {
      view: App2View,
      resolve: {
        random1: {
          resolver: function() {
            return Math.random();
          },
          persist: false,
          store: true
        }
      }
    }
  }
});
