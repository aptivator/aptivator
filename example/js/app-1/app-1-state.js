var aptivator = require('aptivator');
var App1View = require('./app-1');
var HeaderView = require('../header/header');

aptivator.state('app-1', {
  route: 'app-1(/:one)(/:two)',
  routeValues: ['one', 22],
  states: ['header'],
  resolve: {
    run: function() {
      return 'run';
    }
  },
  animate: {
    'root': 'aptivator-fade-in'
  },
  views: {
    'main': {
      address: '.main',
      view: HeaderView
    },
    '.main': {
      view: App1View,
      main: true,
      cache: {
        receiver: 'receiver'  
      },
      resolve: {
        test: {
          resolver: function() {
            return new Promise(function(resolve, reject) {
              setTimeout(function() {
                resolve(true);
              }, 1500);
            });
          },
          persist: false
        },
        
        success: function() {
          return Object;
        },
        
        loggedIn: {
          resolver: function() {
            return new Promise(function(resolve, reject) {
              setTimeout(function() {
                resolve('authorized');
              });
            });
          },
          persist: false,
          store: false
        },
        
        rejected: function() {
          return Promise.resolve('rejecting...');
        }
      }
    }
  }
});
