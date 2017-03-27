let basePath = '../../../../built/';
let vars = require('../../../common/vars');
let Marionette = require('backbone.marionette');
let aptivator = require(basePath + 'lib/aptivator').default;
let starter = require(basePath + 'activation/starter/starter').default;
let preprocessor = require(basePath + 'activation/preprocessor/preprocessor').default;
let resolver = require(basePath + 'activation/resolver/resolver').default;
let eventer = require(basePath + 'activation/eventer/eventer').default;

module.exports = {
  'initialization :: lib': {
    before(client, done) {
      console.log('setting scenarios for lib modules');

      aptivator.state('test', {
        route: 'test',
        view: Marionette.ItemView.extend({})
      });
      
      aptivator.state('other', {
        transient: true
      });
      
      aptivator.state('test.nested', {
        transient: true,
        route: 'nested'
      });
      
      aptivator.state('error', {
        error: true
      });
      
      aptivator.state('app-2', {
        
      });
      
      aptivator.state('app-1', {
        route: {
          path: 'app-1/p:one/:two',
          params: {
            one: {
              value: 1,
              asserter: /\d+/
            },
            
            two: {
              value: 2,
              asserter: /2/
            }
          }
        }
      });
      
      aptivator.state('app-3', {
        route: 'app-3/:one/:two'
      });
      
      aptivator.state('app-4', {
        route: {
          path: 'app-4/p:one(/:two)',
          params: {
            one: {
              value: 1,
              asserter: /\d+/
            }
          }
        }
      });
      
      aptivator.state('app-5', {
        route: {
          path: 'app-5/p:one(/zzz:two)',
          values: [12343, 'dmitriy'],
          asserters: [/\d+/, /[a-z]+/]
        }
      });
      
      aptivator.state('app-6', {
        substates: {
          'tester': {
            route: 'tester/:one/:two',
            data: {
              imagePath: 'image.png',
              apiKey: '777777'
            },
            
            resolves: {
              two: function() {
                return 222;
              }
            },
            
            on: {
              start: function tester() {
                return new Promise(resolve => {
                  setTimeout(() => resolve('tester'));
                });
              }
            },
            
            once: {
              start: function _ignore() {
                
              }
            }
          }
        },
        
        on: {
          start: function something() {
            return 'test';
          }
        },
        
        route: {
          path: 'app-6'
        },
        
        data: {
          apiKey: '12345'
        },
        
        resolves: {
          one: function() {
            return 1;
          },
          
          two: {
            deps: ['one'],
            resolver: function(p) {
              return p.resolves.one + 1;
            }
          }
        }
      });
      
      var app6TesterStateParams = {
        stateName: 'app-6.tester', 
        direct: {dmitriy: 'dmitriy'},
        flags: {},
        routeValues: [1, 2]
      };
      
      preprocessor({stateName: 'test', flags: {}});
      
      starter(app6TesterStateParams).then(stateParams => {
        return eventer('start')(stateParams).then(stateParams => {
          return preprocessor(stateParams);
        });
      }).then(stateParams => {
        return resolver(stateParams);
      }).then(stateParams => {
        vars.app6TesterStateParams = stateParams;
        done();
      });
    }  
  }
};
