'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateName) {
  var transient = _vars2.default.states.registry[stateName].transient;

  var transientConfigs = _lodash2.default.isObject(transient) ? transient : {};
  var baseParams = { keepLast: false, overlay: false };
  var setParams = _lodash2.default.pick(transientConfigs, _lodash2.default.keys(baseParams));
  var immutableParams = { noHistory: true, name: stateName };
  var activation = { params: _lodash2.default.extend(baseParams, setParams, immutableParams) };
  var delay = transientConfigs.delay;


  if (!_lodash2.default.isNumber(delay)) {
    var transientDelay = _vars2.default.configs.transientDelay;

    delay = _lodash2.default.isNumber(transientDelay) ? transientDelay : _vars2.default.transientDelay;
  }

  activation.timeout = setTimeout(function () {
    activation.promise = _instance2.default.activate(activation.params);
    activation.promise = activation.promise.then(_lodash2.default.noop, function (e) {
      return Promise.reject(e);
    });
    activation.promise.catch(_lodash2.default.noop);
  }, delay);

  return { activation: activation };
};