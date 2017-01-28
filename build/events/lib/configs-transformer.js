'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (handle, callback) {
  var o = {};

  handle.split(':').reduce(function (o, part, index, parts) {
    var next = parts[index + 1];
    o[part] = next ? { sub: {} } : {};
    return next ? o[part].sub : o[part];
  }, o).callbacks = [callback];

  return o;
};