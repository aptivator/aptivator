"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (viewConfigs, stateParams) {
  if (stateParams.flags.augment && viewConfigs.rendering.record.active) {
    return true;
  }
};