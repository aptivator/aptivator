"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (e, stateParams) {
  console.error(stateParams.stateName, e);
  return Promise.reject(e);
};