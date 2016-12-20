'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  message: function message(error) {
    return 'aptivator: ' + error;
  },

  'throw': function _throw(error) {
    throw new Error(this.message(error));
  }
};