'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (viewConfigs, stateParams) {
  var rootViews = _lodash2.default.get(stateParams, 'rootViews');
  if (!rootViews) {
    _lodash2.default.set(stateParams, 'rootViews', rootViews = []);
  }

  rootViews.push(viewConfigs);
};