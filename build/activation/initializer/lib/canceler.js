'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = canceler;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function canceler(stateParams) {
  var promises = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var stateNames = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (!stateParams) {
    return promises;
  }

  var stateName = stateParams.stateName;


  if (stateNames.includes(stateName)) {
    return promises;
  }

  stateNames.push(stateName);

  var flags = stateParams.flags,
      transientStateParams = stateParams.transientStateParams,
      parallels = stateParams.parallels;

  var _ref = transientStateParams || {},
      owners = _ref.owners;

  if (owners) {
    owners.delete(stateParams);
  }

  _lodash2.default.extend(flags, { canceled: true });

  if (flags.rendered) {
    _lodash2.default.extend(flags, { active: true });
    var promise = _instance2.default.deactivate({ name: stateName }).catch(_lodash2.default.noop);
    promises.push(promise);
  }

  if (owners && !owners.size) {
    canceler(transientStateParams, promises, stateNames);
  }

  _lodash2.default.each(parallels, function (stateParams) {
    return canceler(stateParams, promises, stateNames);
  });

  return promises;
}