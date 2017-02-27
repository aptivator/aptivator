'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _backbone = require('backbone.marionette');

var _backbone2 = _interopRequireDefault(_backbone);

var _addresser = require('../../lib/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _error = require('../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _relations = require('../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _canceler = require('../canceler/canceler');

var _canceler2 = _interopRequireDefault(_canceler);

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

var reservedHashes = ['base', 'elements'];

exports.default = function (stateParams) {
  (0, _canceler2.default)(stateParams);

  var stateName = stateParams.stateName;

  stateParams.flags.preprocessed = true;

  !function preprocess(stateName, previous) {
    var stateConfigs = registry[stateName];

    var activationSequence = activationSequences[stateName] || (activationSequences[stateName] = []);

    if (previous && !_lodash2.default.isEmpty(activationSequence)) {
      return _lodash2.default.each(activationSequence, function (viewConfigs) {
        if (!previous.includes(viewConfigs)) {
          previous.push(viewConfigs);
        }
      });
    }

    if (stateConfigs.resolveAddresses) {
      return;
    }

    var data = stateConfigs.data,
        resolves = stateConfigs.resolves,
        view = stateConfigs.view,
        views = stateConfigs.views,
        template = stateConfigs.template;

    var resolveAddresses = stateConfigs.resolveAddresses = [];

    if (data) {
      dataParams[stateName] = data;
    }

    if (resolves) {
      resolveDefinitions[stateName] = (0, _resolvesNormalizer2.default)(stateConfigs, stateName);
      resolveAddresses.push(stateName);
    }

    if (_relations2.default.isRoot(stateName)) {
      return stateConfigs.viewsRegistry = (0, _defineProperty3.default)({}, stateConfigs.uniqueAddress, {});
    }

    var viewsRegistry = stateConfigs.viewsRegistry = {};

    if ((view || template) && !views) {
      var viewHash = stateConfigs.parentSelector || '';
      _lodash2.default.extend(stateConfigs, {
        views: (0, _defineProperty3.default)({}, viewHash, _lodash2.default.pick(stateConfigs, ['view', 'template', 'cache']))
      });
    }

    var parentStateName = _relations2.default.parent(stateName);
    var viewCount = _lodash2.default.keys(stateConfigs.views).length;
    var mainCount = 0;

    _lodash2.default.each(stateConfigs.views, function (viewConfigs, viewHash) {
      var _viewConfigs$address = viewConfigs.address,
          address = _viewConfigs$address === undefined ? viewHash : _viewConfigs$address,
          main = viewConfigs.main,
          resolves = viewConfigs.resolves,
          data = viewConfigs.data,
          view = viewConfigs.view,
          template = viewConfigs.template;

      var fullAddress = (0, _fullAddressMaker2.default)(address, stateName);

      var _addresser$parts = _addresser2.default.parts(fullAddress),
          _addresser$parts2 = (0, _slicedToArray3.default)(_addresser$parts, 2),
          addressSelector = _addresser$parts2[0],
          addressStateName = _addresser$parts2[1];

      var uniqueAddress = _addresser2.default.uniqueAddress(stateName);

      if (reservedHashes.includes(viewHash)) {
        _error2.default.throw('view hashes - ' + reservedHashes.join(', ') + ' - are reserved', 'preprocessor');
      }

      if (template && !view) {
        view = _backbone2.default.ItemView.extend({ template: template });
      }

      if (addressStateName !== parentStateName) {
        delete viewConfigs.main;
      }

      if (viewCount === 1) {
        main = true;
      }

      if (main) {
        if (++mainCount > 1) {
          _error2.default.throw('multiple main views for [' + stateName + ']', 'preprocessor');
        }

        _lodash2.default.extend(stateConfigs, { uniqueAddress: uniqueAddress });
      }

      if (resolves) {
        resolveDefinitions[uniqueAddress] = (0, _resolvesNormalizer2.default)(viewConfigs, uniqueAddress);
        resolveAddresses.push(uniqueAddress);
      }

      if (data) {
        dataParams[uniqueAddress] = data;
      }

      _lodash2.default.extend(viewConfigs, { address: address, main: main, view: view, uniqueAddress: uniqueAddress, fullAddress: fullAddress, stateName: stateName, viewHash: viewHash, addressSelector: addressSelector, addressStateName: addressStateName });

      (0, _viewNormalizer2.default)(viewConfigs);
      viewsRegistry[uniqueAddress] = viewConfigs;
      activationSequence.push(viewConfigs);

      preprocess(addressStateName, activationSequence);
    });

    if (!mainCount && viewCount) {
      _error2.default.throw('state [' + stateName + '] must have a designated main view', 'preprocessor');
    }

    if (previous) {
      preprocess(stateName, previous);
    }

    activationSequence.sort(function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _args$map = args.map(function (viewConfigs) {
        return _relations2.default.parts(viewConfigs.stateName).length;
      }),
          _args$map2 = (0, _slicedToArray3.default)(_args$map, 2),
          length1 = _args$map2[0],
          length2 = _args$map2[1];

      return length1 - length2;
    });
  }(stateName);

  return stateParams;
};