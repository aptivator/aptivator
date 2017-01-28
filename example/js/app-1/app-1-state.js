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
    callbacks: function() {},
    sub: {
      'app-1': {
        sub: {
          'error': [function() {
            
          }]
        }
      }
    }
  },
  
  enter: [function tester() {
    
  }, function() {
    
  }]
});

aptivator.on({
  start: {
    sub: {
      'app-1': function tester() {
        
      }
    }
  }
});

aptivator.on('start', function tester1() {
  
});

console.log(aptivator.events());

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
