'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _backbone = require('backbone');

var _backbone2 = _interopRequireDefault(_backbone);

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

var _vars = require('./vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routePartCleanRx = /[\(\/\:\)\*]/g;

exports.default = {
  configure: function configure(parentConfigs, stateConfigs) {
    stateConfigs.routeParts = this.parts.parse(parentConfigs, stateConfigs);
    stateConfigs.routeParts = (parentConfigs.routeParts || []).concat(stateConfigs.routeParts);
    stateConfigs.routeValues = (parentConfigs.routeValues || []).concat(stateConfigs.routeValues || []);
    stateConfigs.route = '' + (parentConfigs.route && parentConfigs.route + '/' || '') + stateConfigs.route;
    stateConfigs.routeRx = _backbone2.default.Router.prototype._routeToRegExp(stateConfigs.route);
  },


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

      routeObj.fragment = fragmentParts.join('/').replace(/(\/+)/g, '/');
      return routeObj;
    },

    parse: function parse(parentConfigs, stateConfigs) {
      var routeParts = stateConfigs.route.match(/\/?[^\/]+/g);
      var hasSplat = parentConfigs.hasSplat,
          hasOptional = parentConfigs.hasOptional;

      var paramNames = (parentConfigs.routeParts || []).reduce(function (paramNames, routePart) {
        if (!_lodash2.default.isUndefined(routePart.required)) {
          paramNames.push(routePart.name);
        }
        return paramNames;
      }, []);

      return !routeParts ? [] : routeParts.map(function (routePart) {
        routePart = routePart.replace(/[\s\/]+/g, '');

        if (!routePart.match(/[\*\:]/g)) {
          if (hasSplat || hasOptional) {
            _error2.default.throw('cannot declare a regular route part after a splat or optional parameter', 'routing');
          }

          return {
            name: routePart.replace(routePartCleanRx, '')
          };
        }

        var paramParts = routePart.split(':');
        var isSplat = routePart.startsWith('*');
        var required = !routePart.includes(')');

        if (isSplat) {
          if (hasSplat) {
            _error2.default.throw('route can have only one splat', 'routing');
          }

          if (hasOptional) {
            _error2.default.throw('splat cannot be declared after an optional parameter', 'routing');
          }
        }

        if (required) {
          if (hasSplat || hasOptional) {
            _error2.default.throw('required parameter cannot be declared after a splat or optional parameter', 'routing');
          }
        }

        if (!required && hasSplat) {
          _error2.default.throw('optional parameter cannot be declared after a splat', 'routing');
        }

        if (!hasSplat && isSplat) {
          stateConfigs.hasSplat = hasSplat = isSplat;
        }

        if (!hasOptional && !required) {
          stateConfigs.hasOptional = hasOptional = !required;
        }

        var prefix = isSplat ? '' : paramParts[0];
        var name = isSplat ? routePart.slice(1) : paramParts[1].replace(routePartCleanRx, '');

        if (paramNames.includes(name)) {
          _error2.default.throw('parameter [' + name + '] has already been declared', 'routing');
        }

        paramNames.push(name);

        return { required: required, prefix: prefix, name: name };
      });
    }
  }
};