'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _addresser = require('../../lib/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _error = require('../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _params = require('../../lib/params');

var _params2 = _interopRequireDefault(_params);

var _relations = require('../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _addressOrderer = require('./lib/address-orderer');

var _addressOrderer2 = _interopRequireDefault(_addressOrderer);

var _cacheable = require('./lib/cacheable');

var _cacheable2 = _interopRequireDefault(_cacheable);

var _siblingsDisplayer = require('./lib/siblings-displayer');

var _siblingsDisplayer2 = _interopRequireDefault(_siblingsDisplayer);

var _viewApi = require('./lib/view-api');

var _viewApi2 = _interopRequireDefault(_viewApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _vars$states = _vars2.default.states,
    activationRecords = _vars$states.activationRecords,
    activationSequences = _vars$states.activationSequences,
    registry = _vars$states.registry;

exports.default = function (stateParams) {
  return new Promise(function (resolve) {
    var activationSequence = activationSequences[stateParams.stateName].activationSequence;


    (0, _addressOrderer2.default)(_lodash2.default.keys(activationSequence)).forEach(function (viewAddressFull) {
      var _addresser$parts = _addresser2.default.parts(viewAddressFull),
          _addresser$parts2 = _slicedToArray(_addresser$parts, 2),
          regionName = _addresser$parts2[0],
          parentStateName = _addresser$parts2[1];

      var parentRecord = activationRecords[parentStateName];
      var multiple = (registry[parentStateName].multiples || []).includes(regionName);
      var parentInstance = parentRecord.instance;
      var regionInstance = parentInstance[regionName];
      var parentRegions = parentRecord.regions || (parentRecord.regions = {});
      var targetRegion = parentRegions[regionName] || (parentRegions[regionName] = {});
      var viewConfigs = activationSequence[viewAddressFull];
      var stateName = viewConfigs.stateName,
          main = viewConfigs.main,
          viewAddressUnique = viewConfigs.viewAddressUnique;

      var cacheAddress = main ? stateName : viewAddressFull;
      var activationRecord = activationRecords[cacheAddress] || (activationRecords[cacheAddress] = {});
      var cache = _cacheable2.default.total(viewConfigs, stateParams, cacheAddress);
      var destroy = !cache && activationRecord.instance;
      var unhide = !destroy && !_lodash2.default.isEmpty(activationRecord);
      var family = _relations2.default.family(stateName).concat(viewAddressUnique);
      var viewParameters = _params2.default.assemble(family, stateParams);

      if (!regionInstance) {
        _error2.default.throw('region [' + regionName + '] does not exist for [' + parentStateName + '] state');
      }

      if (!viewConfigs.cacheAddress) {
        _lodash2.default.extend(viewConfigs, { cacheAddress: cacheAddress });
      }

      if (!targetRegion.current) {
        targetRegion.current = new Set();
      }

      regionInstance._ensureElement();

      if (destroy) {
        _instance2.default.destroy({ name: cacheAddress });
      }

      targetRegion.current.add(cacheAddress);

      if (unhide) {
        (0, _siblingsDisplayer2.default)({ targetRegion: targetRegion, regionInstance: regionInstance, multiple: multiple, includes: [cacheAddress] });

        if (!_cacheable2.default.implicit.cache) {
          if (!_lodash2.default.isObject(cache) || !cache.receiver) {
            _error2.default.throw('receiver function for variable parameters has not been provided');
          }

          activationRecord.instance[cache.receiver](viewParameters);
        }

        return;
      }

      var instance = new viewConfigs.view(viewParameters);
      var serializeData = instance.serializeData;

      instance.serializeData = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var data = serializeData && serializeData.apply(this, args);
        return _lodash2.default.extend(this.options, data, { aptivator: _viewApi2.default });
      };

      (0, _siblingsDisplayer2.default)({ targetRegion: targetRegion, regionInstance: regionInstance, multiple: multiple, excludes: [cacheAddress] });

      _lodash2.default.extend(activationRecord, { active: true, instance: instance });

      instance.on('destroy', function () {
        activationRecord.instance = null;
        targetRegion.current.delete(cacheAddress);
        _lodash2.default.each(activationRecord.regions, function (regionObj) {
          regionObj.current.forEach(function (name) {
            return _instance2.default.deactivate({ name: name, detach: true, focal: true });
          });
        });
      });

      instance.render();
      regionInstance.$el.append(instance.$el);
    });

    resolve(stateParams);
  });
};