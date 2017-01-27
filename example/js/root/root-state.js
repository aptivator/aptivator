var aptivator = require('aptivator');
var MainView = require('./main/main');

aptivator.state('root', {
  route: '',
  routeEnum: {},
  view: MainView,
  resolve: {
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
            resolve(params.resolveParams.one + 1);
          });
        });
      }
    },
    
    three: {
      deps: ['two', 'one'],
      resolver: function(params) {
        return params.resolveParams.two + 1;
      }
    },
    
    resolve: {
      deps: ['three'],
      resolver: function(params) {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve(params.dataParams.loadingMessage);
          });
        });
      }
    }
  },
  
  data: {
    loadingMessage: 'loading...'
  }
});
