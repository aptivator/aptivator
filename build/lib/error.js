'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  message: function message(errorMessage, moduleName) {
    return 'aptivator: ' + (moduleName && moduleName + ': ' || '') + errorMessage;
  },
  throw: function _throw(error, moduleName) {
    throw new Error(this.message(error, moduleName));
  },
  warn: function warn(error, moduleName) {
    console.warn(this.message(error, moduleName));
  },


  errorer: function errorer(e) {
    return console.error(e);
  }
};