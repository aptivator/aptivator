'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var trap = [];

exports.default = function (stateParams) {
  return new Promise(function (resolve) {
    _instance2.default.on('trap-release', function () {
      return setTimeout(function () {
        return resolve(stateParams);
      });
    });

    trap.push(stateParams);

    var trapSize = trap.length;

    setTimeout(function () {
      if (trapSize === trap.length) {
        trap = [];
        _instance2.default.trigger('trap-release');
      }
    });
  });
};