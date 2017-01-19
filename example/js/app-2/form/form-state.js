require('./tester/tester-state');

var aptivator = require('aptivator');
var App2FormView = require('./form');
var PlusView = require('./plus');

aptivator.state('app-2.form', {
  route: 'form',
  states: ['app-2.about', 'header'],
  resolve: {
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
      resolve: {
        something: function(p) {
          return 'something';
        },
        random: {
          resolver: function() {
            return new Promise(function(resolve, reject) {
              setTimeout(function() {
                resolve(Math.random());
              }, 1000);
            });
          },
          persist: false,
          store: true
        }
      }
    }
  }
});
