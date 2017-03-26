var basePath = '../../../../built/';

require(basePath + 'state/state');
var expect = require('chai').expect;
var addresser = require(basePath + 'lib/addresser').default;

module.exports = {
  'lib :: addresser': {
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

