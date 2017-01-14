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


  errorer: function errorer(e) {
    return console.error(e);
  }
};