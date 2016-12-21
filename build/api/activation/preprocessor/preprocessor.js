'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _addresser = require('../../../lib/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _relations = require('../../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _fullAddressMaker = require('./lib/full-address-maker');

var _fullAddressMaker2 = _interopRequireDefault(_fullAddressMaker);

var _resolvesNormalizer = require('./lib/resolves-normalizer');

var _resolvesNormalizer2 = _interopRequireDefault(_resolvesNormalizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (callback, stateParams) {
  var stateName = stateParams.stateName,
      activationSequences = stateParams.activationSequences,
      dataParams = stateParams.dataParams,
      resolveDefinitions = stateParams.resolveDefinitions;


  !function preprocess(stateName, prevSequence) {
    var existingRecord = activationSequences[stateName];

    var _ref = existingRecord || (activationSequences[stateName] = { activationSequence: {} }),
        activationSequence = _ref.activationSequence;

    if (existingRecord) {
      if (prevSequence) {
        _lodash2.default.extend(prevSequence, activationSequence);
      }
      return;
    }

    var stateConfigs = _vars2.default.states.registry[stateName];
    var resolveAddresses = stateConfigs.resolveAddresses = [];

    if (!stateConfigs) {
      callback('state [' + stateName + '] has not been declared');
    }

    dataParams[stateName] = stateConfigs.data;

    if (stateConfigs.resolve) {
      resolveDefinitions[stateName] = (0, _resolvesNormalizer2.default)(stateConfigs, stateName);
      resolveAddresses.push(stateName);
    }

    if (_relations2.default.isRoot(stateName)) {
      return;
    }

    if (stateConfigs.view && !stateConfigs.views) {
      stateConfigs.views = {};
      stateConfigs.main = true;
      stateConfigs.views[stateConfigs.parentRegion || 'main'] = _lodash2.default.pick(stateConfigs, ['view']);
    }

    _lodash2.default.each(stateConfigs.views, function (viewConfigs, viewAddress) {
      var viewAddressFull = (0, _fullAddressMaker2.default)(viewAddress, stateName);
      var viewStateName = _addresser2.default.stateName(viewAddressFull);

      if (activationSequence[viewAddressFull]) {
        callback('view [' + viewAddressFull + '] already exists for [' + activationSequence[viewAddressFull].stateName + '] state');
      }

      if (viewAddress === 'main') {
        stateConfigs.viewAddressFull = viewAddressFull;
        viewConfigs.main = true;
      }

      var viewAddressUnique = viewConfigs.main ? stateName + '@' + stateName : viewAddressFull;

      if (viewConfigs.resolve) {
        resolveDefinitions[viewAddressUnique] = (0, _resolvesNormalizer2.default)(viewConfigs, stateName);
        resolveAddresses.push(viewAddressUnique);
      }

      dataParams[viewAddressUnique] = viewConfigs.data;

      activationSequence[viewAddressFull] = _lodash2.default.extend(viewConfigs, { viewAddress: viewAddress, viewAddressFull: viewAddressFull, stateName: stateName, viewAddressUnique: viewAddressUnique });

      if (viewConfigs.main) {
        preprocess(viewStateName, activationSequence);
      }
    });

    if (prevSequence) {
      _lodash2.default.extend(prevSequence, activationSequence);
    }
  }(stateName);

  callback();
};