let basePath = '../../../../built/';
let chai = require('chai');
let sinon = require('sinon');
let chaiAsPromised = require('chai-as-promised');
let {expect} = chai;
let connector = require(basePath + 'activation/connector/connector').default;
let {registry} = require(basePath + 'lib/vars');

let stateConfigs = registry['connector'];
let {one, two, three, four} = stateConfigs.views;

chai.use(chaiAsPromised);

module.exports = {
  'activation :: connector': {
    before() {
      connector({stateName: 'connector'});
    },
    
    'intercepts and retransmits the function call to receiver': function(client, done) {
      one.record.instance.testerReceiver = data => {
        let promise = Promise.resolve(data.tester);
        expect(promise).to.eventually.equal('tester').notify(done);
      };
      
      two.record.instance.tester();
    },
    
    'intercepts event hash and retransmits to receiver': function(client, done) {
      one.record.instance.keyupReceiver = data => {
        let promise = Promise.resolve(data.keyup);
        expect(promise).to.eventually.equal('keyup').notify(done);
      };
      
      two.record.instance.keyup();
    },
    
    'gives multiple intercepts to a single immediately called function': function(client, done) {
      one.record.instance.forAll = data => {
        let keysCount = Object.keys(data).length;
        
        if(keysCount === 1) {
          let promise = Promise.resolve(data.tester1);
          expect(promise).to.eventually.equal('tester');
        } else {
          let promise = Promise.resolve(data);
          expect(forAllSpy.callCount).to.equal(2);
          expect(promise).to.eventually.eql({tester1: 'tester', keyup1: 'keyup'}).notify(done);
        }
      };
      
      let forAllSpy = sinon.spy(one.record.instance, 'forAll');
      
      three.record.instance.tester();
      three.record.instance.keyup();
    },
    
    'gives multiple intercepts together to a single receiver function': function(client, done) {
      one.record.instance.forAllComplete = data => {
        let promise = Promise.resolve(data);
        expect(forAllCompleteSpy.callCount).to.equal(1);
        expect(promise).to.eventually.eql({tester2: 'tester', keyup2: 'keyup'}).notify(done);
      };
      
      let forAllCompleteSpy = sinon.spy(one.record.instance, 'forAllComplete');
      
      four.record.instance.tester();
      four.record.instance.keyup();
    }
  }
};
