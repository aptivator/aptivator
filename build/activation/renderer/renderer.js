'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _displayer = require('../../lib/displayer');

var _displayer2 = _interopRequireDefault(_displayer);

var _error = require('../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _params = require('../../lib/params');

var _params2 = _interopRequireDefault(_params);

var _relations = require('../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _canceler = require('../canceler/canceler');

var _canceler2 = _interopRequireDefault(_canceler);

var _cacheable = require('./lib/cacheable');

var _cacheable2 = _interopRequireDefault(_cacheable);

var _viewApi = require('./lib/view-api');

var _viewApi2 = _interopRequireDefault(_viewApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _vars$states = _vars2.default.states,
    activationRecords = _vars$states.activationRecords,
    activationSequences = _vars$states.activationSequences,
    registry = _vars$states.registry;

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(stateParams) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            (0, _canceler2.default)(stateParams);

            stateParams.flags.rendered = true;

            activationSequences[stateParams.stateName].forEach(function (viewConfigs) {
              var stateName = viewConfigs.stateName,
                  viewAddressUnique = viewConfigs.viewAddressUnique,
                  viewSelector = viewConfigs.viewSelector,
                  viewStateName = viewConfigs.viewStateName,
                  detachHidden = viewConfigs.detachHidden;

              var parentViewAddressUnique = registry[viewStateName].viewAddressUnique;
              var parentRecord = activationRecords[parentViewAddressUnique];
              var $parentEl = parentRecord.instance.$el;
              var $regionEl = !viewSelector ? $parentEl : $parentEl.find(viewSelector).eq(0);

              if (!$regionEl.length) {
                _error2.default.throw('region [' + viewSelector + '] does not exist for [' + viewStateName + '] state');
              }

              var parentRegions = parentRecord.regions || (parentRecord.regions = {});
              var targetRegion = parentRegions[viewSelector] || (parentRegions[viewSelector] = { current: new Set() });
              var activationRecord = activationRecords[viewAddressUnique] || (activationRecords[viewAddressUnique] = {});
              var cache = _cacheable2.default.total(viewConfigs, stateParams);
              var destroy = !cache && activationRecord.instance;
              var unhide = !destroy && !_lodash2.default.isEmpty(activationRecord);
              var family = _relations2.default.family(stateName).concat(viewAddressUnique);
              var viewParameters = _params2.default.assemble(family, stateParams);

              if (destroy) {
                _instance2.default.destroy({ name: viewAddressUnique });
              }

              if (unhide) {
                if (!_cacheable2.default.implicit.cache) {
                  if (!_lodash2.default.isObject(cache) || !cache.receiver) {
                    _error2.default.throw('receiver function for variable parameters has not been provided');
                  }

                  activationRecord.instance[cache.receiver](viewParameters);
                }

                return _displayer2.default.display(viewAddressUnique, $regionEl);
              }

              var instance = new viewConfigs.view(viewParameters);
              var serializeData = instance.serializeData;

              targetRegion.current.add(viewAddressUnique);

              _lodash2.default.extend(activationRecord, { active: true, instance: instance, detached: true, detach: detachHidden });

              instance.serializeData = function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
                }

                var data = serializeData && serializeData.apply(this, args);
                return _lodash2.default.extend(this.options, data, { aptivator: _viewApi2.default });
              };

              instance.on('destroy', function () {
                _instance2.default.deactivate({ name: viewAddressUnique, forward: true, detach: { children: true } });
                targetRegion.current.delete(viewAddressUnique);
                delete activationRecord.instance;
              });

              _displayer2.default.display(viewAddressUnique, $regionEl);
            });

            return _context.abrupt('return', stateParams);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();