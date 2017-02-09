require('./tester/tester-state');
require('./message/message-state');

var aptivator = require('aptivator');
var App2FormView = require('./form');
var PlusView = require('./plus');

aptivator.on({
  errored: {
    callbacks: function(e, stateParams) {
      console.log('general error callback: ', e, stateParams);
    },
    sub: {
      'app-2.form': {
        callbacks: function(e, stateParams) {
          console.log('general error callback for app-2.form: ', e, stateParams);
        },
        sub: {
          canceled: function something(e, stateParams) {
            console.log('specific callback for canceled error under app-2.form state: ', e, stateParams);
            return 'something';
          }
        }
      },
      canceled: function(e, stateParams) {
        console.log('callback for all canceled errors: ', e, stateParams);
      }
    }
  }
});

aptivator.state('app-2.form', {
  route: 'form',
  states: ['app-2.about', 'header'],
  resolves: {
    main: function() {
      return 'main';
    }
  },
  
  views: {
    '.main': {
      view: App2FormView,
      main: true
    },
    
    '.plus@app-2.form': {
      view: PlusView,
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
          persist: false,
          store: true
        }
      }
    }
  }
});
