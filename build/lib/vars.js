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

  eventSplitter: /\s+/,

  rootStateName: 'root',

  router: new _backbone2.default.Router(),

  states: {
    activationRecords: {},
    activationSequences: {},
    activeTransient: undefined,
    error: [],
    pending: new Set(),
    queue: [],
    registry: {},
    transient: []
  },

  resolveDefinitions: {},

  resolveParams: {},

  transientDelay: 300,

  viewsRegistry: {}
};