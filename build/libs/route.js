'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _backbone = require('backbone');

var _backbone2 = _interopRequireDefault(_backbone);

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

var _vars = require('./vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var paramRx = /(\(?\/?([\w-]+)?\:[\w-]+\)?)|(\*[\w-]+)/g;
var paramCleanRx = /[\(\/\:\)\*]/g;

exports.default = {
  make: function make(parent, child) {
    return parent ? parent + '/' + child : child;
  },

  toRx: _backbone2.default.Router.prototype._routeToRegExp,

  params: {
    assemble: function assemble(stateName, routeValues) {
      var stateConfig = _vars2.default.states.registry[stateName];
      if (!stateConfig.route) {
        return;
      }
      var fragmentParts = [];
      var routeParts = stateConfig.route.split(/[\/]|(?:\s*(?=\*))/);
      var index = -1;
      var routeObj = { params: {} };

      _underscore2.default.isEmpty(routeValues) && (routeValues = stateConfig.routeValues || []);

      routeParts.forEach(function (routePart) {
        if (!/[\:\*]/.test(routePart)) {
          return fragmentParts.push(routePart.replace(paramCleanRx, ''));
        }

        var param = stateConfig.routeParams[++index];

        if (param.required && !routeValues[index]) {
          _error2.default.throw('Expecting a value for [' + param.name + '] parameter');
        }

        if (routeValues[index]) {
          routeObj.params[param.name] = routeValues[index];
          fragmentParts.push(param.prefix + routeValues[index]);
        }
      });

      routeObj.fragment = fragmentParts.join('/').replace(/(\/+)/g, '/');
      routeObj.stateName = stateName;
      return routeObj;
    },

    parse: function parse(route) {
      var params = route.match(paramRx);
      return !params ? [] : params.map(function (param) {
        var paramParts = param.split(':');
        return {
          required: /^[^\(|\*]/.test(param),
          prefix: param.startsWith('*') ? '' : paramParts[0].replace(paramCleanRx, ''),
          name: param.startsWith('*') ? param.slice(1) : paramParts[1].replace(paramCleanRx, '')
        };
      });
    }
  }
};