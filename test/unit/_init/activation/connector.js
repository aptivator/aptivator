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

          }, Backbone.Events)
        },
        deps: {
          views: {
            'two': {
              intercept: {
                'tester': {
                  storeAs: 'tester',
                  receivers: 'testerReceiver'
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
            tester() {
              return 'tester';
            }
          }, Backbone.Events)
        }
      };
      
      aptivator.state('connector', {
        views: {
          'one': oneView,
          'two': twoView
        },
        connectingViews: [oneView]
      });
    }
  }
};
