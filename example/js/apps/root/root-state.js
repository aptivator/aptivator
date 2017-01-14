var aptivator = require('aptivator');
var MainView = require('./main/main');

aptivator.config({
  el: '#application',
  view: MainView,
  historySize: 25,
  resolveConfigs: {
    persist: true,
    store: true,
  },
  transientDelay: 300,
  detachHidden: false,
  //multiples: ['main'],
  defaultState: 'app-1',
  showRuntime: true,
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
