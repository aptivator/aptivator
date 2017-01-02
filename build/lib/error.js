'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  message: function message(error, moduleName) {
    return 'aptivator: ' + (moduleName && moduleName + ':' || '') + ' ' + error;
  },

  'throw': function _throw(error, moduleName) {
    throw new Error(this.message(error, moduleName));
  }
};