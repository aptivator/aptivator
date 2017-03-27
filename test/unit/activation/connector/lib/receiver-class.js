let basePath = '../../../../../built/';
let {expect} = require('chai');
let sinon = require('sinon');
let Receiver = require(basePath + 'activation/connector/lib/receiver-class').default;

module.exports = {
  'activation :: connector :: receiver class': {
    'invokes a single-parameter receiver': function(client, done) {
      let receiver = 'tester';
      let instance = {
        tester(data) {
          expect(data.val1).to.equal(22);
        }
      };
      let params = ['val1'];
      let receiverConfigs = {
        complete: false
      };
      
      let handler = new Receiver(instance, receiver, receiverConfigs, params);
      handler(22, 'val1').then(() => done());
    },
    
    'invokes a multiple-parameters receiver when one value is given': function(client, done) {
      let receiver = 'tester';
      let instance = {tester(data) {}};
      let spy = sinon.spy(instance, 'tester');
      let params = ['val1', 'val2', 'val3'];
      let receiverConfigs = {
        complete: false
      };
      
      let handler = new Receiver(instance, receiver, receiverConfigs, params);

      let promises = [
        handler(22, 'val1'),
        handler(23, 'val3'),
        handler(24, 'val2')
      ];

      Promise.all(promises).then(() => {
        expect(spy.callCount).to.equal(3);
        done();
      });
    },
    
    'invokes a multiple-parameters receiver when all values are given with no reset': function(client, done) {
      let receiver = 'tester';
      let instance = {tester(data) {}};
      let spy = sinon.spy(instance, 'tester');
      let params = ['val1', 'val2', 'val3'];
      let receiverConfigs = {
        complete: true
      };
      
      let handler = new Receiver(instance, receiver, receiverConfigs, params);
      
      let promises = [
        handler(22, 'val1'),
        handler(23, 'val3'),
        handler(24, 'val2'),
        handler(55, 'val1'),
        handler(55, 'val3')
      ];
      
      Promise.all(promises).then(() => {
        expect(spy.callCount).to.equal(3);
        done();
      });
    },
    
    'invokes a multiple-parameters receiver when all values are given and then resets': function(client, done) {
      let receiver = 'tester';
      let instance = {tester(data) {console.log(data);}};
      let spy = sinon.spy(instance, 'tester');
      let params = ['val1', 'val2', 'val3'];
      let receiverConfigs = {
        complete: true,
        reset: true
      };
      
      let handler = new Receiver(instance, receiver, receiverConfigs, params);
      
      let promises = [
        handler(22, 'val1'),
        handler(23, 'val3'),
        handler(24, 'val2')
      ];

      Promise.all(promises).then(() => {
        return Promise.all([
          handler(55, 'val1'),
          handler(56, 'val2')
        ]);
      }).then(() => {
        expect(spy.callCount).to.equal(1);
        done();
      });
    }
  }
};
