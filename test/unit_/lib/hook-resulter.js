let expect = require('chai').expect;
let vars = require('../../common/vars');
let {app6TesterStateParams} = vars;

module.exports = {
  'lib :: hook resulter': {
    'appends results from trigger() to state params': function() {
      let {hooks} = app6TesterStateParams;
      expect(hooks).to.eql({
        start: {
          'app-6.tester': {
            v: {
              tester: 'tester'
            }
          }
        }
      });
    }
  }
};
