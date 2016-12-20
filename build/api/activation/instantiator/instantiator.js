'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _backbone = require('backbone');

var _backbone2 = _interopRequireDefault(_backbone);

var _backbone3 = require('backbone.marionette');

var _backbone4 = _interopRequireDefault(_backbone3);

var _addresser = require('../../../libs/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _params = require('../../../libs/params');

var _params2 = _interopRequireDefault(_params);

var _relations = require('../../../libs/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../../libs/vars');

var _vars2 = _interopRequireDefault(_vars);

var _templateApi = require('./template-api');

var _templateApi2 = _interopRequireDefault(_templateApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var buildViewsLeveledTree = function buildViewsLeveledTree(viewAddresses) {
  var roots = viewAddresses.filter(function (viewAddress) {
    return _relations2.default.isRoot(_addresser2.default.stateName(viewAddress));
  });
  var comparator = function comparator(viewAddress1, viewAddress2) {
    return _addresser2.default.stateName(viewAddress1).length > _addresser2.default.stateName(viewAddress2).length;
  };

  viewAddresses = _lodash2.default.difference(viewAddresses, roots);
  viewAddresses.sort(comparator);
  viewAddresses = roots.concat(viewAddresses);

  return viewAddresses.reduce(function (tree, viewAddress) {
    var familySize = _relations2.default.family(_addresser2.default.stateName(viewAddress)).length;
    if (familySize !== tree.currentFamilySize) {
      tree.currentFamilySize = familySize;
      _lodash2.default.isUndefined(tree.level) && (tree.level = -1);
      tree[++tree.level] = [];
    }
    tree[tree.level].push(viewAddress);
    return tree;
  }, []);
};

exports.default = function (callback, p) {
  var activatedStateName = p.stateName,
      dataParams = p.dataParams,
      routeParams = p.routeParams,
      directParams = p.directParams,
      resolveParams = p.resolveParams,
      viewsRegistry = p.viewsRegistry;

  var viewsTree = buildViewsLeveledTree(_lodash2.default.keys(viewsRegistry));
  var stateToInstance = _defineProperty({}, _vars2.default.rootStateName, _vars2.default.states.registry[_vars2.default.rootStateName].instance);

  viewsTree.forEach(function (level, levelIndex) {
    level.forEach(function (viewAddress, viewAddressIndex) {
      var viewConfig = viewsRegistry[viewAddress];
      var region = _addresser2.default.region(viewAddress);
      var stateName = _addresser2.default.stateName(viewAddress, activatedStateName);
      var family = _relations2.default.family(stateName);
      var originStateName = viewConfig.stateName;
      var originFamily = _relations2.default.family(originStateName);
      family = family.concat(_lodash2.default.difference(originFamily, family)).concat(viewAddress);
      var parameters = _params2.default.assemble(family, dataParams, routeParams, directParams, resolveParams);
      var instance = new viewConfig.view(parameters);
      var serializeData = instance.serializeData;

      instance.serializeData = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var data = serializeData && serializeData.apply(instance, args);
        data || (data = {});
        data.aptivator = _templateApi2.default;
        return data;
      };

      stateToInstance[stateName][region].show(instance);
      stateToInstance[originStateName] = instance;
      callback();
    });
  });
};