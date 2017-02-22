var aptivator = require('aptivator');
var MainView = require('./main/main');

aptivator.state('root', {
  route: '',
  routeEnum: {},
  view: MainView,
  animate: {
    enter: {
      self: {
        base: 'aptivator-fade-in',
        elements: {
          //'.tester': 'border-blue'
        }
      }
    },
    
    exit: 'aptivator-fade-out'
  },
  resolves: {
    dmitriy: function() {
      return 'dmitriy';
    },
    
    one: {
      resolver: function() {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve(1);
          });
        });
      }
    },
    
    two: {
      deps: ['one'],
      resolver: function(params) {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve(params.resolves.one + 1);
          });
        });
      }
    },
    
    three: {
      deps: ['two', 'one'],
      resolver: function(params) {
        return params.resolves.two + 1;
      }
    },
    
    resolve: {
      deps: ['three'],
      resolver: function(params) {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve(params.data.loadingMessage);
          });
        });
      }
    }
  },
  
  data: {
    loadingMessage: 'loading...'
  }
});
