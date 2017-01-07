'use strict';

require('./api/history/history');

require('./api/storage/storage');

require('./api/utils/utils');

require('./api/setup/setup');

require('./api/start/start');

require('./api/activation/activation');

require('./api/deactivation/deactivation');

var _instance = require('./lib/instance');

var _instance2 = _interopRequireDefault(_instance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _instance2.default;