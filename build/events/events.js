'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _on = require('./on/on');

var _on2 = _interopRequireDefault(_on);

var _once = require('./once/once');

var _once2 = _interopRequireDefault(_once);

var _off = require('./off/off');

var _off2 = _interopRequireDefault(_off);

var _trigger = require('./trigger/trigger');

var _trigger2 = _interopRequireDefault(_trigger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_lodash2.default.extend(_instance2.default, { on: _on2.default, once: _once2.default, off: _off2.default, trigger: _trigger2.default });