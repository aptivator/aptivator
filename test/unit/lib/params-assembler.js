var basePath = '../../../built/';
var expect = require('chai').expect;
var vars = require('../../common/vars');
var paramsAssembler = require(basePath + 'lib/params-assembler').default;

module.exports = {
  'lib :: params assembler': {
    'assembles params from stateParams and internal data stores': function() {
      console.log(vars.app6TesterStateParams);
    }
  }  
};
