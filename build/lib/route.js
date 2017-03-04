'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

var _vars = require('./vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  parts: {
    assemble: function assemble(stateName, routeValues) {
      var stateConfigs = _vars2.default.states.registry[stateName];
      var fragmentParts = [];
      var index = -1;
      var routeObj = { params: {} };

      if (!stateConfigs.route) {
        return;
      }

      if (_lodash2.default.isEmpty(routeValues)) {
        routeValues = stateConfigs.routeValues || [];
      }

      stateConfigs.routeParts.forEach(function (routePart) {
        if (_lodash2.default.isUndefined(routePart.required)) {
          return fragmentParts.push(routePart.name);
        }

        if (!routeValues[++index] && routePart.required) {
          _error2.default.throw('expecting a value for [' + routePart.name + '] parameter', 'routing');
        }

        if (routeValues[index]) {
          routeObj.params[routePart.name] = routeValues[index];
          fragmentParts.push(routePart.prefix + routeValues[index]);
        }
      });

      var fragment = fragmentParts.join('/').replace(/(\/+)/g, '/');
      return _lodash2.default.extend(routeObj, { fragment: fragment, stateName: stateName });
    }
  }
};