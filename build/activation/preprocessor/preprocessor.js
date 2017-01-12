'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _addresser = require('../../lib/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _error = require('../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _relations = require('../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _fullAddressMaker = require('./lib/full-address-maker');

var _fullAddressMaker2 = _interopRequireDefault(_fullAddressMaker);

var _resolvesNormalizer = require('./lib/resolves-normalizer');

var _resolvesNormalizer2 = _interopRequireDefault(_resolvesNormalizer);

var _viewNormalizer = require('./lib/view-normalizer');

var _viewNormalizer2 = _interopRequireDefault(_viewNormalizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var activationSequences = _vars2.default.states.activationSequences;

exports.default = function (stateParams) {
  return new Promise(function (resolve) {
    var stateName = stateParams.stateName,
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

      var parentStateName = _relations2.default.parent(stateName);
      var stateConfigs = _vars2.default.states.registry[stateName];
      var resolveAddresses = stateConfigs.resolveAddresses = [];
      var mainViews = [];

      if (!stateConfigs) {
        _error2.default.throw('state [' + stateName + '] has not been declared', 'preprocessor');
      }

      stateConfigs.viewsRegistry = {};

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
        stateConfigs.views[stateConfigs.parentRegion || 'main'] = _lodash2.default.pick(stateConfigs, ['view', 'main']);
      }

      _lodash2.default.each(stateConfigs.views, function (viewConfigs, viewAddress) {
        var viewAddressFull = (0, _fullAddressMaker2.default)(viewAddress, stateName);
        var viewStateName = _addresser2.default.stateName(viewAddressFull);
        var viewAddressUnique = _lodash2.default.uniqueId('aptivator-id-') + '@' + stateName;

        if (activationSequence[viewAddressFull] || prevSequence && prevSequence[viewAddressFull]) {
          _error2.default.throw('view [' + viewAddressFull + '] already exists', 'preprocessor');
        }

        if (viewStateName !== parentStateName) {
          delete viewConfigs.main;
        }

        if (viewAddress === 'main') {
          viewConfigs.main = true;
        }

        if (viewConfigs.main) {
          mainViews.push(viewAddress);

          if (mainViews.length > 1) {
            _error2.default.throw('The following views [' + mainViews.join(', ') + '] are main for [' + stateName + ']');
          }

          _lodash2.default.extend(stateConfigs, { viewAddressFull: viewAddressFull });
        }

        if (viewConfigs.resolve) {
          resolveDefinitions[viewAddressUnique] = (0, _resolvesNormalizer2.default)(viewConfigs, viewAddressUnique);
          resolveAddresses.push(viewAddressUnique);
        }

        dataParams[viewAddressUnique] = viewConfigs.data;

        activationSequence[viewAddressFull] = _lodash2.default.extend(viewConfigs, { viewAddress: viewAddress, viewAddressFull: viewAddressFull, stateName: stateName, viewAddressUnique: viewAddressUnique });

        (0, _viewNormalizer2.default)(viewConfigs);

        stateConfigs.viewsRegistry[viewAddressFull] = viewConfigs;

        if (viewConfigs.main) {
          preprocess(viewStateName, activationSequence);
        }
      });

      _lodash2.default.each(stateConfigs.states, function (stateName) {
        return preprocess(stateName, activationSequence);
      });

      if (prevSequence) {
        _lodash2.default.extend(prevSequence, activationSequence);
      }
    }(stateName);

    resolve(stateParams);
  });
};