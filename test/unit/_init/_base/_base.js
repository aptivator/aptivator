let basePath = '../../../../built/';
require(basePath + 'state/state');
require(basePath + 'events/events');
let Marionette = require('backbone.marionette');
let aptivator = require(basePath + 'lib/aptivator').default;

module.exports = {
  'initialization :: base': {
    before() {
      console.log('setting state(), events methods, and root state');
      
      aptivator.state('root', {
        testMode: true,
        route: '',
        view: Marionette.ItemView.extend({}),
        data: {
          names: ['Fiora', 'Fiona']
        }
      });
    }
  }
};
