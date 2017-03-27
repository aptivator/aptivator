let basePath = '../../../../built/';
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let {expect} = chai;
let connector = require(basePath + 'activation/connector/connector').default;
let {registry} = require(basePath + 'lib/vars');

module.exports = {
  'activation :: connector': {
    'intercepts and retransmits the function call to receiver': function(client, done) {
      connector({stateName: 'connector'});
      let stateConfigs = registry['connector'];
      let {one, two} = stateConfigs.views;

      one.record.instance.testerReceiver = data => {
        let promise = Promise.resolve(data.tester);
        expect(promise).to.eventually.equal('tester').notify(done);
      };
      
      two.record.instance.tester();
    }
  }
};
