'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _aptivator = require('../../../lib/aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateName, immediate) {
  var stateParams = stateName;

  if (!_lodash2.default.isObject(stateParams)) {
    var transient = _vars2.default.states.registry[stateName].transient;

    var _ref = _lodash2.default.isObject(transient) ? transient : {},
        delay = _ref.delay,
        _ref$parallel = _ref.parallel,
        parallel = _ref$parallel === undefined ? false : _ref$parallel,
        _ref$noResolves = _ref.noResolves,
        noResolves = _ref$noResolves === undefined ? false : _ref$noResolves;

    stateParams = { stateName: stateName, flags: { parallel: parallel, transient: true, noResolves: noResolves } };
  }

  _lodash2.default.extend(stateParams, { owners: new Set() });

  var transientConfigs = stateParams.transientConfigs = {};

  if (immediate) {
    delay = 0;
  } else if (!_lodash2.default.isNumber(delay)) {
    var transientDelay = _vars2.default.configs.transientDelay;

    delay = _lodash2.default.isNumber(transientDelay) ? transientDelay : _vars2.default.transientDelay;
  }

  transientConfigs.timeout = setTimeout(function () {
    var promise = _aptivator2.default.activate(stateParams);
    promise = promise.then(_lodash2.default.noop, function (e) {
      return Promise.reject(e);
    });
    _lodash2.default.extend(transientConfigs, { promise: promise });
    promise.catch(_lodash2.default.noop);
  }, delay);

  return stateParams;
};