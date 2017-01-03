'use strict';

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _utils = require('../../lib/utils');

var _utils2 = _interopRequireDefault(_utils);

var _queueChecker = require('./queue-checker/queue-checker');

var _queueChecker2 = _interopRequireDefault(_queueChecker);

var _rootViewBuilder = require('./root-view-builder/root-view-builder');

var _rootViewBuilder2 = _interopRequireDefault(_rootViewBuilder);

var _starter = require('./starter/starter');

var _starter2 = _interopRequireDefault(_starter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_instance2.default.start = function () {
  _utils2.default.waterfall([_queueChecker2.default, _rootViewBuilder2.default], _starter2.default);
};