var aptivator = require('aptivator');
var App1View = require('./app-1');

aptivator.state('app-1', {
  route: 'app-1(/:one)(/:two)',
  routeValues: ['one', 22],
  //states: ['header'],
  resolve: {
    run: function() {
      return 'run';
    }
  },
  cache: {
    receiver: 'receiver'  
  },
  views: {
    main: {
      view: App1View,
      resolve: {
        test: {
          resolver: function() {
            return new Promise(function(resolve, reject) {
              setTimeout(function() {
                resolve(true);
              }, 2000);
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
