'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _canceler = require('../canceler/canceler');

var _canceler2 = _interopRequireDefault(_canceler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var states = _vars2.default.states;

exports.default = function (stateParams) {
  (0, _canceler2.default)(stateParams);

  var stateName = stateParams.stateName,
      isTransient = stateParams.isTransient;


  states.pending.delete(stateParams);

  states.activeTransient = isTransient ? stateName : undefined;

  if (stateParams.time) {
    console.log('%cruntime: ' + (_lodash2.default.now() - stateParams.time) + 'ms', 'color: green;');
  }

  delete stateParams.transient;
  delete stateParams.isTransient;
  delete stateParams.time;

  return stateParams;
};