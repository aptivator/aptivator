'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (stateParams) {
  if (stateParams.time) {
    console.log('%cruntime: ' + (Date.now() - stateParams.time) + 'ms', 'color: green;');
  }
};