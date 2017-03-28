let basePath = '../../../../built/';
let {expect} = require('chai');
let eventer = require(basePath + 'activation/eventer/eventer').default;

module.exports = {
  'invokes sync hooks and appends trigger results to state params': function(client, done) {
    eventer('start')({stateName: 'eventer'}).then(stateParams => {
      expect(stateParams).to.eql({
        stateName: 'eventer',
        hooks: {
          start: {
            eventer: {
              v: {
                tester: 'tester'
              }
            }
          }
        }
      });
    });
    
    done();
  },
  
  'invokes async hooks and resolves state params': function(client, done) {
    eventer('exit')({stateName: 'eventer'}).then(stateParams => {
      expect(stateParams).to.eql({stateName: 'eventer'});
      done();
    });
  },
  
  'invokes async hooks and appends trigger results later': function(client, done) {
    eventer('exit')({stateName: 'eventer'}).then(stateParams => {
      setTimeout(() => {
        expect(stateParams).to.eql({
          stateName: 'eventer',
          hooks: {
            exit: {
              eventer: {
                v: {
                  tester: 'tester'
                }
              }
            }
          }
        });
        
        done();
      });
    });
  }
};
