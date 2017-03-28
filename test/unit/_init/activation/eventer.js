let basePath = '../../../../built/';
let aptivator = require(basePath + 'lib/aptivator').default;

module.exports = {
  'initialization :: activation :: eventer': {
    before() {
      aptivator.state('eventer', {
        on: {
          start: function tester() {
            return new Promise(resolve => {
              setTimeout(() => resolve('tester'), 500);
            });
          },
          
          exit: function tester() {
            return 'tester';
          }
        }
      });
    }
  }
};
