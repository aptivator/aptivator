"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (e, stateParams) {
  console.error(e);
  return Promise.reject(e);
};