'use strict';

require('./libs/storage');

require('./api/setup');

require('./api/start');

require('./api/utils');

require('./api/activation');

var _instance = require('./libs/instance');

var _instance2 = _interopRequireDefault(_instance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _instance2.default;