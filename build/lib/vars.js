'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _backbone = require('backbone');

var _backbone2 = _interopRequireDefault(_backbone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  historySize: 25,

  rootStateName: 'root',

  router: new _backbone2.default.Router(),

  states: {
    activationRecords: {},
    activationSequences: {},
    error: [],
    queue: [],
    registry: {},
    transient: []
  },

  viewsRegistry: {}
};