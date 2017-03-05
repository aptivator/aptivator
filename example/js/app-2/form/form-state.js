require('./tester/tester-state');
require('./message/message-state');

var aptivator = require('aptivator');
var App2FormView = require('./form');
var PlusView = require('./plus');

/*
aptivator.on({
  error: {
    callbacks: function(e, stateParams) {
      console.log('general error callback: ', e, stateParams);
    },
    
    'app-2.form': {
      callbacks: function(e, stateParams) {
        console.log('general error callback for app-2.form: ', e, stateParams);
      },
      
      canceled: function something(e, stateParams) {
        console.log('specific callback for canceled error under app-2.form state: ', e, stateParams);
        return 'something';
      }
    },
    
    canceled: function(e, stateParams) {
      console.log('callback for all canceled errors: ', e, stateParams);
    }
  }
});
*/

aptivator.state('app-2.form', {
  route: 'form',
  states: ['header', 'app-2.info', 'app-2.about'],
  resolves: {
    main: function() {
      return 'main';
    }
  },

  animate: {
    enter: {
      self: {
        //'.plus@self': 'border-blue'
      }
    }
  },

  views: {
    '.main': {
      view: App2FormView,
      main: true
    },
    
    'hidden': {
      cache: false,
      view: (function() {
        function Tracker(params) {}
        
        Tracker.prototype.printer = function(data) {
          console.log('from non-view', data.result);
        };
        
        return Tracker;
      })(),
      deps: {
        views: {
          '.main': {
            intercept: {
              'click button': {
                storeAs: 'result',
                receivers: ['printer']
              }
            }
          }
        }
      }
    },
    
    '.plus@self': {
      view: PlusView,
      deps: {
        views: {
          '.main': {
            intercept: {
              'click button': {
                storeAs: 'result',
                receivers: ['handler'],
                local: true
              },
              'inputer': {
                storeAs: 'input-text',
                receivers: ['texter']
              }
            }
          }
        }
      },
      resolves: {
        something: function(p) {
          return 'something';
        },
        random: {
          resolver: function() {
            return new Promise(function(resolve, reject) {
              setTimeout(function() {
                resolve(Math.random());
              }, 2000);
            });
          },
          duration: 0,
          store: true
        }
      }
    }
  }
});
