'use strict';

var _instance = require('../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _queueChecker = require('./lib/queue-checker');

var _queueChecker2 = _interopRequireDefault(_queueChecker);

var _rootViewBuilder = require('./lib/root-view-builder');

var _rootViewBuilder2 = _interopRequireDefault(_rootViewBuilder);

var _invalidRouteHandler = require('./lib/invalid-route-handler');

var _invalidRouteHandler2 = _interopRequireDefault(_invalidRouteHandler);

var _starter = require('./lib/starter');

var _starter2 = _interopRequireDefault(_starter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_instance2.default.start = function () {
  return (0, _queueChecker2.default)().then(_rootViewBuilder2.default).then(_invalidRouteHandler2.default).then(_starter2.default).catch(console.error.bind(console));
};