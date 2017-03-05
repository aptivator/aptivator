'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _approximator = require('./approximator');

var _approximator2 = _interopRequireDefault(_approximator);

var _aptivator = require('./aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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