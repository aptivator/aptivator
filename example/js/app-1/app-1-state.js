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


aptivator.on({
  start: {
    callbacks: [function tester1() {
      return 22;
    }, function another() {
      return 'another';
    }],
    sub: {
      'app-1': {
        callbacks: function zero() {
          return 0;
        },
        sub: {
          'error': {
            callback: function context() {
              return this.two;
            },
            context: {
              two: 2
            }
          }
        }
      }
    }
  }
});

aptivator.trigger({handle: 'start:app-1:error', full: true}).then(function(results) {
  console.log(results);
});



/*
aptivator.trigger({
  paths: [{
    path: 'start:app-1',
    focal: true
  }, 'start:app-2'],
  args: console
});
*/

aptivator.state('app-1', {
  route: 'app-1(/:one)(/:two)',
  routeValues: ['one', 22],
  states: ['header'],
  resolves: {
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
      resolves: {
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
