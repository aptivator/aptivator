var aptivator = require('aptivator');
var App1View = require('./app-1');
var HeaderView = require('../header/header');
/*
route = {
  path: 'app-1(/:one)(/:two)',
  params: {
    one: {
      value: 'one',
      assert: ['test', 'another']
    },
    
    two: {
      value: 22,
      assert: /^d+$/i
    }
  },
  values: ['one', 22],
  assert: {
    one: ['test', 'another'],
    two: /^d+$/i
  }
};
*/

aptivator.on('state-change-start-app-1', function() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      console.log('resolving...');
      resolve();
    }, 2000);
  });
});

aptivator.on('start-app-1', function() {
  console.log('starting app-1');
});

aptivator.on('loading-app-1', function() {
  console.log('loading app-1');
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      console.log('finished pausing for 2000ms');
      resolve();
    }, 500);
  });
});

aptivator.on('loaded-app-1', function() {
  console.log('loaded app-1');
});

aptivator.on('enter-app-1', function() {
  console.log('entered app-1');
});

aptivator.on('error-app-1', function() {
  console.log('error in app-1');
});

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
