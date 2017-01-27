'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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

var dataParams = _vars2.default.dataParams,
    resolveDefinitions = _vars2.default.resolveDefinitions,
    states = _vars2.default.states;
var activationSequences = states.activationSequences,
    registry = states.registry;

exports.default = function (stateParams) {
  var stateName = stateParams.stateName;


  !function preprocess(stateName, previousSequence) {
    var stateConfigs = registry[stateName];

    if (!stateConfigs) {
      _error2.default.throw('state [' + stateName + '] has not been declared', 'preprocessor');
    }

    var activationSequence = activationSequences[stateName] || (activationSequences[stateName] = []);

    if (!_lodash2.default.isEmpty(activationSequence)) {
      if (previousSequence) {
        var uniqueValues = _lodash2.default.uniq(previousSequence.concat(activationSequence));
        previousSequence.splice.apply(previousSequence, [0, previousSequence.length].concat((0, _toConsumableArray3.default)(uniqueValues)));
      }
      return;
    }

    if (stateConfigs.resolveAddresses) {
      return;
    }

    var resolveAddresses = stateConfigs.resolveAddresses = [];

    if (stateConfigs.data) {
      dataParams[stateName] = stateConfigs.data;
    }

    if (stateConfigs.resolve) {
      resolveDefinitions[stateName] = (0, _resolvesNormalizer2.default)(stateConfigs, stateName);
      resolveAddresses.push(stateName);
    }

    if (_relations2.default.isRoot(stateName)) {
      return;
    }

    stateConfigs.viewsRegistry = {};

    if (stateConfigs.view && !stateConfigs.views) {
      stateConfigs.views = {};
      stateConfigs.main = true;
      stateConfigs.views[stateConfigs.parentSelector || ''] = _lodash2.default.pick(stateConfigs, ['view', 'cache']);
    }

    var parentStateName = _relations2.default.parent(stateName);
    var viewCount = _lodash2.default.keys(stateConfigs.views).length;
    var mainViews = [];

    _lodash2.default.each(stateConfigs.views, function (viewConfigs, viewAddress) {
      if (viewConfigs.address) {
        viewAddress = viewConfigs.address;
      }

      var viewAddressFull = (0, _fullAddressMaker2.default)(viewAddress, stateName);

      var _addresser$parts = _addresser2.default.parts(viewAddressFull),
          _addresser$parts2 = (0, _slicedToArray3.default)(_addresser$parts, 2),
          viewSelector = _addresser$parts2[0],
          viewStateName = _addresser$parts2[1];

      var viewAddressUnique = _lodash2.default.uniqueId('aptivator-id-') + '@' + stateName;
      var duplicateViewConfigs = (previousSequence || []).concat(activationSequence).filter(function (viewConfigs) {
        return viewConfigs.viewAddressFull === viewAddressFull;
      });
      var otherView = (duplicateViewConfigs[0] || {}).view;

      if (otherView === viewConfigs.view) {
        return;
      }

      if (viewStateName !== parentStateName) {
        delete viewConfigs.main;
      }

      if (viewCount === 1) {
        viewConfigs.main = true;
      }

      if (viewConfigs.main) {
        mainViews.push(viewAddress);

        if (mainViews.length > 1) {
          _error2.default.throw('The following views [' + mainViews.join(', ') + '] are main for [' + stateName + ']');
        }

        _lodash2.default.extend(stateConfigs, { viewAddressUnique: viewAddressUnique });
      }

      if (viewConfigs.resolve) {
        resolveDefinitions[viewAddressUnique] = (0, _resolvesNormalizer2.default)(viewConfigs, viewAddressUnique);
        resolveAddresses.push(viewAddressUnique);
      }

      if (viewConfigs.data) {
        dataParams[viewAddressUnique] = viewConfigs.data;
      }

      (0, _viewNormalizer2.default)(viewConfigs);
      stateConfigs.viewsRegistry[viewAddressUnique] = viewConfigs;
      _lodash2.default.extend(viewConfigs, { viewAddressFull: viewAddressFull, stateName: stateName, viewAddressUnique: viewAddressUnique, viewSelector: viewSelector, viewStateName: viewStateName });
      activationSequence.push(viewConfigs);

      if (viewConfigs.main) {
        return preprocess(viewStateName, activationSequence);
      }
    });

    if (!mainViews.length && stateConfigs.views) {
      _error2.default.throw('main view should be specified for [' + stateName + ']');
    }

    _lodash2.default.each(stateConfigs.states, function (parallelStateName) {
      preprocess(parallelStateName, activationSequence);
    });

    if (previousSequence) {
      preprocess(stateName, previousSequence);
    }

    activationSequence.sort(function (viewConfigs1, viewConfigs2) {
      return _relations2.default.parts(_addresser2.default.stateName(viewConfigs1.viewAddressUnique)).length - _relations2.default.parts(_addresser2.default.stateName(viewConfigs2.viewAddressUnique)).length;
    });
  }(stateName);

  return stateParams;
};