"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (parentConfigs, regionName) {
  var multiples = parentConfigs.multiples;

  return (multiples || []).includes(regionName);
};