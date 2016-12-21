'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _backbone = require('backbone.marionette');

var _backbone2 = _interopRequireDefault(_backbone);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (callback) {
  var rootStateConfigs = _vars2.default.states.registry[_vars2.default.rootStateName];
  var rootView = new (_backbone2.default.LayoutView.extend({
    el: 'html',
    regions: {
      main: rootStateConfigs.el || 'body'
    }
  }))();
  var instance = rootView;

  if (rootStateConfigs.view) {
    instance = new rootStateConfigs.view();
    rootView.main.show(instance);
  }

  _vars2.default.states.activationRecords[_vars2.default.rootStateName] = { instance: instance };

  callback();
};