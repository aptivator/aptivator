'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _vars$states = _vars2.default.states,
    activationSequences = _vars$states.activationSequences,
    registry = _vars$states.registry;

exports.default = function (stateParams) {
  var stateName = stateParams.stateName,
      dataParams = stateParams.dataParams,
      resolveDefinitions = stateParams.resolveDefinitions;


  !function preprocess(stateName, previousSequence) {
    var stateConfigs = registry[stateName];

    if (!stateConfigs) {
      _error2.default.throw('state [' + stateName + '] has not been declared', 'preprocessor');
    }

    var activationSequence = activationSequences[stateName] || (activationSequences[stateName] = []);

    if (!_lodash2.default.isEmpty(activationSequence)) {
      if (previousSequence) {
        previousSequence.splice.apply(previousSequence, [previousSequence.length, 0].concat(_toConsumableArray(activationSequence)));
      }
      return;
    }

    var parentStateName = _relations2.default.parent(stateName);
    var resolveAddresses = stateConfigs.resolveAddresses = [];
    var transient = !!stateConfigs.transient;
    var mainViews = [];

    dataParams[stateName] = stateConfigs.data;

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
      stateConfigs.views[stateConfigs.parentRegion || 'main'] = _lodash2.default.pick(stateConfigs, ['view', 'main']);
    }

    _lodash2.default.each(stateConfigs.views, function (viewConfigs, viewAddress) {
      var viewAddressFull = (0, _fullAddressMaker2.default)(viewAddress, stateName);

      var _addresser$parts = _addresser2.default.parts(viewAddressFull),
          _addresser$parts2 = _slicedToArray(_addresser$parts, 2),
          viewRegionName = _addresser$parts2[0],
          viewStateName = _addresser$parts2[1];

      var multiple = (registry[viewStateName].multiples || []).includes(viewRegionName);
      var viewAddressUnique = _lodash2.default.uniqueId('aptivator-id-') + '@' + stateName;
      var duplicateViewConfigs = (previousSequence || []).concat(activationSequence).filter(function (viewConfigs) {
        return viewConfigs.viewAddressFull === viewAddressFull;
      });
      var otherView = (duplicateViewConfigs[0] || {}).view;

      if (!multiple && otherView) {
        if (otherView === viewConfigs.view) {
          return;
        }

        _error2.default.throw('two different views are trying to use [' + viewAddressFull + '] address', 'preprocessor');
      }

      if (multiple) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = duplicateViewConfigs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var duplicateViewConfig = _step.value;

            if (duplicateViewConfig.view === viewConfigs.view) {
              return;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
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

        _lodash2.default.extend(stateConfigs, { viewAddressUnique: viewAddressUnique });
      }

      if (viewConfigs.resolve) {
        resolveDefinitions[viewAddressUnique] = (0, _resolvesNormalizer2.default)(viewConfigs, viewAddressUnique);
        resolveAddresses.push(viewAddressUnique);
      }

      dataParams[viewAddressUnique] = viewConfigs.data;

      (0, _viewNormalizer2.default)(viewConfigs);
      stateConfigs.viewsRegistry[viewAddressUnique] = viewConfigs;
      _lodash2.default.extend(viewConfigs, { viewAddressFull: viewAddressFull, stateName: stateName, viewAddressUnique: viewAddressUnique, multiple: multiple, viewRegionName: viewRegionName, viewStateName: viewStateName, transient: transient });
      activationSequence.push(viewConfigs);

      if (viewConfigs.main) {
        preprocess(viewStateName, activationSequence);
      }
    });

    _lodash2.default.each(stateConfigs.states, function (stateName) {
      return preprocess(stateName, activationSequence);
    });

    if (previousSequence) {
      preprocess(stateName, previousSequence);
    }

    activationSequence.sort(function (viewConfigs1, viewConfigs2) {
      return _relations2.default.parts(_addresser2.default.stateName(viewConfigs1.viewAddressUnique)).length > _relations2.default.parts(_addresser2.default.stateName(viewConfigs2.viewAddressUnique)).length;
    });
  }(stateName);

  return stateParams;
};