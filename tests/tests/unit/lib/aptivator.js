var basePath = '../../../../built/';

var expect = require('chai').expect;
var aptivator = require(basePath + 'lib/aptivator').default;

module.exports = {
  'lib :: aptivator': {
    'is an object': function() {
      expect(aptivator).to.be.an('object');
    },
    
    'has a method state() that was added to it': function() {
      expect(aptivator).to.have.property('state');
    }
  }  
};
