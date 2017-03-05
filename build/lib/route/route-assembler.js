'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _error = require('../error');

var _error2 = _interopRequireDefault(_error);

var _errorStater = require('../error-stater');

var _errorStater2 = _interopRequireDefault(_errorStater);

var _vars = require('../vars');

var _vars2 = _interopRequireDefault(_vars);

var _routeAsserter = require('./route-asserter');

var _routeAsserter2 = _interopRequireDefault(_routeAsserter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registry = _vars2.default.states.registry;

var moduleName = 'route assembler';

exports.default = function (stateName, routeValues, activating) {
  var stateConfigs = registry[stateName];

  if (!stateConfigs) {
    _error2.default.throw('state [' + stateName + '] does not exist', moduleName);
  }

  var _stateConfigs$route = stateConfigs.route,
      route = _stateConfigs$route === undefined ? {} : _stateConfigs$route;


  if (_lodash2.default.isEmpty(route)) {
    _error2.default.throw('state [' + stateName + '] does not have a route', moduleName);
  }

  var _route$values = route.values,
      values = _route$values === undefined ? [] : _route$values,
      parts = route.parts,
      asserters = route.asserters;

  var fragments = [];
  var index = -1;
  var routeObj = { params: {} };

  if (_lodash2.default.isEmpty(routeValues)) {
    routeValues = values;
  }

  if (asserters.length) {
    if (!(0, _routeAsserter2.default)(routeValues, asserters)) {
      if (activating) {
        (0, _errorStater2.default)();
      }

      _error2.default.throw('a route value did not pass validation', moduleName);
    }
  }

  _lodash2.default.each(parts, function (part) {
    var required = part.required,
        name = part.name,
        prefix = part.prefix;


    if (_lodash2.default.isUndefined(required)) {
      return fragments.push(name);
    }

    if (!routeValues[++index] && required) {
      _error2.default.throw('expecting a value for [' + name + '] parameter', moduleName);
    }

    if (routeValues[index]) {
      routeObj.params[name] = routeValues[index];
      fragments.push(prefix + routeValues[index]);
    }
  });

  var fragment = fragments.join('/').replace(/(\/+)/g, '/');
  return _lodash2.default.extend(routeObj, { fragment: fragment, stateName: stateName });
};