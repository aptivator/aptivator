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

exports.default = function (stateName, stateParams) {
  var transient = _vars2.default.states.registry[stateName].transient;

  var transientConfigs = _lodash2.default.isObject(transient) ? transient : {};
  var owners = [_lodash2.default.cloneDeep(stateParams)];
  var currentOwners = new Set(owners);
  var params = { stateName: stateName, owners: owners, currentOwners: currentOwners, flags: { parallel: false, transient: true } };
  var activation = { params: params };
  var delay = transientConfigs.delay;

  /*
  if(_.isObject(transient)) {
    _.extend(params.flags, _.pick(transient, ['noResolves']));
  }
  */

  if (!_lodash2.default.isNumber(delay)) {
    var transientDelay = _vars2.default.configs.transientDelay;

    delay = _lodash2.default.isNumber(transientDelay) ? transientDelay : _vars2.default.transientDelay;
  }

  activation.timeout = setTimeout(function () {
    activation.promise = _instance2.default.activate(params);
    activation.promise = activation.promise.then(_lodash2.default.noop, function (e) {
      return Promise.reject(e);
    });
    activation.promise.catch(_lodash2.default.noop);
  }, delay);

  return activation;
};