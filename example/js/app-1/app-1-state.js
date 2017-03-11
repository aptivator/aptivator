var _ = require('lodash');
var aptivator = require('aptivator');
var App1View = require('./app-1');
var HeaderView = require('../header/header');

aptivator.on({
  start: function dmitriy(stateParams) {
    return 'dmitriy';
  },
  exit: {
    'app-1': function(stateParams) {
      console.log('exited', stateParams.stateName);
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve();
        });
      });
    },
    
    loading: function exited(stateParams) {
      console.log('exited', stateParams.stateName);
      return 'exited';
    }
  }
});

aptivator.state('app-1', {
  substates: {
    'another': {
      route: {
        path: 'another/:three'
      },
      views: {
        '.main@root': {
          view: HeaderView,
          main: true
        }
      }
    }
  },
  route: {
    path: 'app-1/:one/:two',
    values: ['one', 'one'],
    asserters: [undefined, /^one|two|test$/],
    params: {
      two: {
        asserter: /^one|two|test$/
      }
    }
  },
  states: [{
    name: 'header',
    direct: true,
    route: true
  }],
  
  resolves: {
    run: function() {
      return 'run';
    }
  },
  
  once: {
    start: function once(stateParams) {
      console.log('starting once', stateParams.stateName);
    }
  },
  
  on: {
    start: function one(stateParams) {
      return 'one';
    },
    
    loading: {
      callbacks: [function two(stateParams, params) {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve(2);
          });
        });
      }]
    },
    
    loaded: [function three(stateParams) {
        //console.log('loaded', stateParams.stateName);
        return 3;
      }
    ],
    
    enter: function four(stateParams) {
      //console.log('entered', stateParams.stateName);
      return 4;
    },
    
    error: {
      fail: function(stateParams) {
        console.log('failed...');
      }
    }
  },
  
  views: {
    'main': {
      address: '.main',
      view: HeaderView
    },
    
    'main-2': {
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
          duration: 0
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
          duration: 0,
          store: false
        },
        
        rejected: function() {
          return Promise.resolve('rejecting...');
        }
      }
    }
  }
});
