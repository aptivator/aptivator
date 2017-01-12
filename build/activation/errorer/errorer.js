"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (e, reject) {
  console.log(e instanceof Error);
  console.error(e);
  reject(e);
};