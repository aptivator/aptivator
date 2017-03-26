var basePath = '../../../../built/';

var expect = require('chai').expect;
var errorer = require(basePath + 'lib/error').default;

module.exports = {
  'lib :: error': {
    'formats an error message (with module name)': function() {
      var message = errorer.message('error message', 'module');
      expect(message).to.equal('aptivator: module: error message');
    },
    
    'formats an error message (without module name)': function() {
      var message = errorer.message('error message');
      expect(message).to.equal('aptivator: error message');
    },
    
    'throws an error with message': function() {
      expect(errorer.throw).to.throw(Error);
    },
    
    'prints a message using console.warn': function() {
      var warn = console.warn;
      console.warn = function(message) {
        return message;
      };
      var message = errorer.warn('error message', 'module');
      expect(message).to.equal('aptivator: module: error message');
      console.warn = warn;
    },
    
    'prints a message using console.error': function() {
      var error = console.error;
      console.error = function(message) {
        return message;
      };
      var message = errorer.errorer('error message');
      expect(message).to.equal('error message');
      console.error = error;
    }
  }
};
