var basePath = '../../../built/';
require(basePath + 'state/state');
require(basePath + 'events/events');
var vars = require('../../common/vars');
var Marionette = require('backbone.marionette');
var aptivator = require(basePath + 'lib/aptivator').default;
var starter = require(basePath + 'activation/starter/starter').default;
var preprocessor = require(basePath + 'activation/preprocessor/preprocessor').default;
var resolver = require(basePath + 'activation/resolver/resolver').default;

module.exports = {
  before: function(done) {
    console.log('initializing lib unit testing scenarios');
    
    aptivator.state('root', {
      testMode: true,
      route: '',
      view: Marionette.ItemView.extend({}),
      data: {
        base: {
          names: ['Fiora', 'Fiona']
        }
      }
    });
    
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
          route: 'tester/:one/:two'
        },
        
        data: {
          imagePaths: '/image/path.png'
        },
        
        resolves: {
          two: function() {
            return 22222222222;
          }
        }
      },
      
      route: {
        path: 'app-6'
      },
      
      data: {
        apiKey: 'asdfadfwer12341r234'
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
      return preprocessor(stateParams);
    }).then(stateParams => {
      return resolver(stateParams);
    }).then(stateParams => {
      vars.app6TesterStateParams = stateParams;
      done();
    });
  }  
};
