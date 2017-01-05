'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  message: function message(error, moduleName) {
    return new Error('aptivator: ' + (moduleName && moduleName + ': ' || '') + error);
  },

  'throw': function _throw(error, moduleName) {
    throw this.message(error, moduleName);
  },


  console: function (_console) {
    function console(_x) {
      return _console.apply(this, arguments);
    }

    console.toString = function () {
      return _console.toString();
    };

    return console;
  }(function (e) {
    return console.error(e);
  })
};