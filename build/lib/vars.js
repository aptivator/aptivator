'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _backbone = require('backbone');

var _backbone2 = _interopRequireDefault(_backbone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  configs: {},

  dataParams: {},

  eventRegistry: {},

  paramsMap: {},

  rootStateName: 'root',

  router: new _backbone2.default.Router(),

  resolveDefinitions: {},

  resolveParams: {},

  spaceSplitter: /\s+/,

  states: {
    activationRecords: {},
    activationSequences: {},
    error: [],
    history: [],
    queue: [],
    registry: {},
    transient: []
  },

  transientDelay: 300,

  viewsRegistry: {}
};