'use strict';

var _backbone = require('backbone');

var _backbone2 = _interopRequireDefault(_backbone);

var _backbone3 = require('backbone.marionette');

var _backbone4 = _interopRequireDefault(_backbone3);

var _instance = require('../../libs/instance');

var _instance2 = _interopRequireDefault(_instance);

var _error = require('../../libs/error');

var _error2 = _interopRequireDefault(_error);

var _fragment = require('../../libs/fragment');

var _fragment2 = _interopRequireDefault(_fragment);

var _utils = require('../../libs/utils');

var _utils2 = _interopRequireDefault(_utils);

var _vars = require('../../libs/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_instance2.default.start = function () {
  return _utils2.default.waterfall([function checkStatesQueue(callback) {
    if (!_vars2.default.states.queue.length) {
      return callback();
    }
    var undefinedStateNames = _vars2.default.states.queue.map(function (stateDefinition) {
      return stateDefinition[0];
    }).join(', ');
    callback('unable to initialize [' + undefinedStateNames + '] states');
  }, function createRootView(callback) {
    var rootStateConfigs = _vars2.default.states.registry[_vars2.default.rootStateName];
    var RootView = _backbone4.default.LayoutView.extend({
      el: 'html',
      regions: {
        main: rootStateConfigs.el || 'body'
      }
    });

    var rootView = new RootView();
    var mainView = rootView;

    if (rootStateConfigs.view) {
      mainView = new rootStateConfigs.view();
      rootView.main.show(mainView);
    }

    _vars2.default.states.activationRecords[_vars2.default.rootStateName] = { instance: mainView };

    callback();
  }], function (err) {
    if (err) {
      return _error2.default.throw(err);
    }

    var rootStateConfigs = _vars2.default.states.registry[_vars2.default.rootStateName];
    var defaultStates = rootStateConfigs.defaultStates;


    _backbone2.default.history.start();

    if (!_fragment2.default.toState() && defaultStates) {
      defaultStates.forEach(function (stateName) {
        return _instance2.default.activate({ stateName: stateName, directParams: { running: true } });
      });
    }
  });
};