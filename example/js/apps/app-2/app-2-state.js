require('./about/about-state');
require('./form/form-state');
require('./info/info-state');

var aptivator = require('aptivator');
var App2View = require('./app-2');

aptivator.state('app-2', {
  route: 'app-2',
  abstract: true,
  states: ['header'],
  //multiples: ['main'],
  views: {
    main: {
      view: App2View,
      resolve: {
        random: {
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
