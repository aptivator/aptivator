'use strict';

var _instance = require('../../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _relations = require('../../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _route = require('../../../lib/route');

var _route2 = _interopRequireDefault(_route);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var registry = _vars2.default.states.registry;


_instance2.default.state = function (stateName, stateConfigs) {
  function state() {
    var parentStateName = _relations2.default.parent(stateName);
    var parentConfigs = registry[parentStateName];

    if (!_relations2.default.isRoot(parentStateName) && !parentConfigs) {
      _vars2.default.states.queue.push([stateName, stateConfigs]);
      return _instance2.default;
    }

    registry[stateName] = stateConfigs;

    if (stateConfigs.route) {
      _route2.default.configure(parentConfigs, stateConfigs);
      _vars2.default.router.route(stateConfigs.route, stateName, function () {
        for (var _len = arguments.length, routeValues = Array(_len), _key = 0; _key < _len; _key++) {
          routeValues[_key] = arguments[_key];
        }

        routeValues = routeValues.filter(function (value) {
          return value;
        });
        var routeParams = _route2.default.parts.assemble(stateName, routeValues);
        _instance2.default.activate({ stateName: stateName, routeParams: routeParams });
      });
    }

    return _vars2.default.states.queue.length ? _instance2.default.state.apply(_instance2.default, _toConsumableArray(_vars2.default.states.queue.pop())) : _instance2.default;
  }

  try {
    return state();
  } catch (e) {
    console.error(e);
  }
};