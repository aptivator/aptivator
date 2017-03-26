var basePath = '../../built/';
require(basePath + 'state/state');
var Marionette = require('backbone.marionette');
var aptivator = require(basePath + 'lib/aptivator').default;
var preprocessor = require(basePath + 'activation/preprocessor/preprocessor').default;

module.exports = {
  before: function() {
    console.log('initializing testing scenarios');
    
    aptivator.state('root', {
      testMode: true,
      route: '',
      view: Marionette.ItemView.extend({})
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
    
    preprocessor({stateName: 'test', flags: {}});
  }  
};
