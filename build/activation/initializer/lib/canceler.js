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
  if (!canceler.promises) {
    _lodash2.default.extend(canceler, { promises: [], stateNames: [] });
  }

  var promises = canceler.promises,
      stateNames = canceler.stateNames;


  if (!stateParams) {
    return promises;
  }

  var stateName = stateParams.stateName;


  if (stateNames.includes(stateName)) {
    return;
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
    canceler(transientStateParams);
  }

  _lodash2.default.each(parallels, function (stateParams) {
    return canceler(stateParams);
  });

  return promises;
}