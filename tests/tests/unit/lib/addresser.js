var basePath = '../../../../built/';

require(basePath + 'state/state');
var Marionette = require('backbone.marionette');
var expect = require('chai').expect;
var addresser = require(basePath + 'lib/addresser').default;
var aptivator = require(basePath + 'lib/aptivator').default;
var preprocessor = require(basePath + 'activation/preprocessor/preprocessor').default;

module.exports = {
  'lib :: addresser': {
    'determines if an stateName address is linked to a state': function() {
      expect(addresser.isStateAddress('app-2')).to.be.true;
    },
    
    'determine if a unique address is linked to a state': function() {
      aptivator.state('root', {
        testMode: true,
        route: '',
        view: Marionette.ItemView.extend({})
      });
        
      aptivator.state('test', {
        route: 'test',
        view: Marionette.ItemView.extend({})
      });
      
      preprocessor({stateName: 'test', flags: {}});
      
      expect(addresser.isStateAddress('aptivator-id-2@test')).to.be.true;
    },
  
    'generates a unique view address': function() {
      let uniqueAddress = addresser.uniqueAddress('app');
      expect(uniqueAddress).to.equal('aptivator-id-3@app');
    },
    
    'splits an address into two parts': function() {
      let address = 'aptivator-id-22@app';
      let parts = addresser.parts(address);
      expect(parts).to.eql(['aptivator-id-22', 'app']);
    },
    
    'returns a region part of the full address': function() {
      let region = addresser.region('.main > .class@auth.forgot');
      expect(region).to.equal('.main > .class');
    },
    
    'returns a region part of the partial address': function() {
      let region = addresser.region('.main > .class');
      expect(region).to.equal('.main > .class');
    },
    
    'returns a state part of the full address': function() {
      let stateName = addresser.stateName('.main > .class@interactive');
      expect(stateName).to.equal('interactive');
    },
    
    'returns a state part of the partial address': function() {
      let stateName = addresser.stateName('app-2');
      expect(stateName).to.equal('app-2');
    },
    
    'outputs an activation record associated with an address': function() {
      var record = addresser.record('aptivator-id-2@test');
      expect(record).to.be.undefined;
    }
  }  
};

