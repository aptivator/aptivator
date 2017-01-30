'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (record) {
  return record.handle.split(':').length;
};