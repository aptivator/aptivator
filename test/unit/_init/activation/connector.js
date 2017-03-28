let basePath = '../../../../built/';
let _ = require('lodash');
let Backbone = require('backbone');
let aptivator = require(basePath + 'lib/aptivator').default;

module.exports = {
  'initialization :: activation :: connector': {
    before() {
      console.log('setting scenario for connector module');
      
      let oneView = {
        viewHash: 'one',
        record: {
          instance: _.extend({
            forAll() {},
            forAllComplete() {}
          }, Backbone.Events)
        },
        deps: {
          views: {
            'two': {
              intercept: {
                'tester': {
                  storeAs: 'tester',
                  receivers: 'testerReceiver'
                },
                
                'keyup .element': {
                  storeAs: 'keyup',
                  receivers: {
                    'keyupReceiver': {
                      complete: false
                    }
                  }
                }
              }
            },
            
            'three': {
              receivers: 'forAll',
              intercept: {
                'tester': {
                  storeAs: 'tester1'
                },
                
                'keyup .element': {
                  storeAs: 'keyup1'
                }
              }
            },
            
            'four': {
              receivers: {
                'forAllComplete': {
                  complete: true
                }
              },
              intercept: {
                'tester': {
                  storeAs: 'tester2'
                },
                
                'keyup .element': {
                  storeAs: 'keyup2'
                }
              }
            }
          }
        }
      };
      
      let twoView = {
        viewHash: 'two',
        record: {
          instance: _.extend({
            events: {
              'keyup .element': 'keyup'
            },
            keyup() {
              return 'keyup';
            },
            tester() {
              return 'tester';
            }
          }, Backbone.Events)
        }
      };
      
      let threeView = {
        viewHash: 'three',
        record: {
          instance: _.extend({
            events: {
              'keyup .element': 'keyup'
            },
            keyup() {
              return 'keyup';
            },
            tester() {
              return 'tester';
            }
          }, Backbone.Events)
        }
      };
      
      let fourView = {
        viewHash: 'four',
        record: {
          instance: _.extend({
            events: {
              'keyup .element': 'keyup'
            },
            keyup() {
              return 'keyup';
            },
            tester() {
              return 'tester';
            }
          }, Backbone.Events)
        }
      };
      
      aptivator.state('connector', {
        views: {
          'one': oneView,
          'two': twoView,
          'three': threeView,
          'four': fourView
        },
        connectingViews: [oneView]
      });
    }
  }
};
