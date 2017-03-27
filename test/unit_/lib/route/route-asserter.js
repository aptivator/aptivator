var basePath = '../../../../built/';
var expect = require('chai').expect;
var routeAsserter = require(basePath + 'lib/route/route-asserter').default;

module.exports = {
  'lib :: route :: route asserter': {
    'returns true when no asserters are specified': function() {
      var values = [1, 2, 3];
      var result = routeAsserter(values);
      expect(result).to.be.true;
    },
    
    'returns true when all of the asserters are true': function() {
      var values = [1, 'dmitriy'];
      var asserters = [/\d+/, /\w+/];
      var result = routeAsserter(values, asserters);
      expect(result).to.be.true;
    },
    
    'returns undefined when one of the asserters fails': function() {
      var values = [1, 'dmitriy'];
      var asserters = [/\d+/, /\d+/];
      var result = routeAsserter(values, asserters);
      expect(result).to.be.undefined;
    }
  }
};
