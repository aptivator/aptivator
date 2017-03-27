let basePath = '../../../../../built/';
let {expect} = require('chai');
let receiversNormalizer = require(basePath + 'activation/connector/lib/receivers-normalizer').default;

module.exports = {
  'activation :: connector :: receivers normalizer': {
    'processes receiver specified as string': function() {
      let normalized = receiversNormalizer('tester');
      expect(normalized).to.eql({
        tester: {
          complete: false
        }
      });
    },
    
    'processes receivers specified as array of strings': function() {
      let normalized = receiversNormalizer(['tester', 'another']);
      expect(normalized).to.eql({
        tester: {complete: false},
        another: {complete: false}
      });
    },
    
    'processes receivers specified as object': function() {
      let receivers = {
        tester: {
          complete: true
        },
        other: {
          complete: false,
          local: true
        }
      };
      
      let normalized = receiversNormalizer(receivers);
      expect(normalized).to.eql(receivers);
    }
  }
};
