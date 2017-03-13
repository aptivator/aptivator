'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _error = require('../../../lib/error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routePartCleanRx = /[\(\/\:\)\*]/g;

exports.default = function (route, parentRoute) {
  var path = route.path;

  var parts = path.match(/\/?[^\/]+/g);
  var hasSplat = parentRoute.hasSplat,
      hasOptional = parentRoute.hasOptional,
      _parentRoute$parts = parentRoute.parts,
      parentParts = _parentRoute$parts === undefined ? [] : _parentRoute$parts;

  var names = parentParts.reduce(function (names, part) {
    if (!_lodash2.default.isUndefined(part.required)) {
      names.push(part.name);
    }
    return names;
  }, []);

  parts = !parts ? [] : parts.map(function (part) {
    part = part.replace(/[\s\/]+/g, '');

    if (!part.match(/[\*\:]/g)) {
      if (hasSplat || hasOptional) {
        _error2.default.throw('cannot declare a regular route part after a splat or optional parameter', 'routing');
      }

      return { name: part.replace(routePartCleanRx, '') };
    }

    var paramParts = part.split(':');
    var isSplat = part.startsWith('*');
    var required = !part.includes(')');

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
      route.hasSplat = hasSplat = isSplat;
    }

    if (!hasOptional && !required) {
      route.hasOptional = hasOptional = !required;
    }

    var prefix = isSplat ? '' : paramParts[0];
    var name = isSplat ? part.slice(1) : paramParts[1].replace(routePartCleanRx, '');

    if (names.includes(name)) {
      _error2.default.throw('parameter [' + name + '] has already been declared', 'routing');
    }

    names.push(name);

    return { required: required, prefix: prefix, name: name };
  });

  _lodash2.default.extend(route, { parts: parentParts.concat(parts) });
};