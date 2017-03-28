let basePath = '../../../../built/';
let {expect} = require('chai');
let finalizer = require(basePath + 'activation/finalizer/finalizer').default;

module.exports = {
  'activation :: finalizer': {
    'sets pending and active flags to false and true respectively': function() {
      let stateParams = finalizer({flags: {pending: true, active: false}});
      expect(stateParams.flags).to.eql({pending: false, active: true});
    },
    
    'displays runtime if time param is truthy and adds endTime param': function() {
      var oldLog = console.log;
      console.log = message => {
        expect(message).to.match(/runtime/);
      };
      
      let stateParams = finalizer({time: Date.now()});
      
      expect(stateParams.endTime).to.be.ok;
      
      console.log = oldLog;
    }
  }
};
