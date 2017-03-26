var basePath = '../../../built/';
var expect = require('chai').expect;
var approximator = require(basePath + 'lib/approximator').default;

module.exports = {
  'lib :: approximator': {
    'approximates state name from hash': function() {
      let stateName = approximator.fromHash('test');
      expect(stateName).to.equal('test');
    },
    
    'returns undefined if state name cannot be approximated': function() {
      let stateName = approximator.fromHash('tests');
      expect(stateName).to.be.undefined;
    },
    
    'finds a transient state name closest to the approximated stateName': function() {
      let stateName = approximator.fromStateName('transient', 'test');
      expect(stateName).to.equal('other');
    },
    
    'finds a nested transient state name closest to the approximate state name': function() {
      let stateName = approximator.fromStateName('transient', 'test.message');
      expect(stateName).to.equal('test.nested');
    },
    
    'finds an error state closest to the approximate state name': function() {
      let stateName = approximator.fromStateName('error', 'test');
      expect(stateName).to.equal('error');
    }
  }  
};
