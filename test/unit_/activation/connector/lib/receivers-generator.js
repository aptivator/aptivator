let basePath = '../../../../../built/';
let {expect} = require('chai');
let sinon = require('sinon');
let receiversGenerator = require(basePath + 'activation/connector/lib/receivers-generator').default;

module.exports = {
  'activation :: connector :: receivers generator': {
    'produces an array of receiver handlers': function(client, done) {
      let instance = {
        tester() {},
        another() {}
      };
      
      let receivers = {
        tester: {
          complete: true,
          reset: false
        },
        
        another: {
          complete: false
        }
      };
      
      let params = ['val1', 'val2'];
      let testerSpy = sinon.spy(instance, 'tester');
      let anotherSpy = sinon.spy(instance, 'another');
      let handlers = receiversGenerator(instance, receivers, params);
      let [tester, another] = handlers;
      
      let promises = [
        tester(22, 'val1'),
        tester(23, 'val2'),
        another(22, 'val1'),
        another(23, 'val2')
      ];
      
      Promise.all(promises).then(() => {
        expect(testerSpy.callCount).to.equal(1);
        expect(anotherSpy.callCount).to.equal(2);
        done();
      });
    }
  }  
};
