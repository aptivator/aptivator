'use strict';

require('./history/history');

require('./storage/storage');

require('./utils/utils');

require('./setup/setup');

require('./start/start');

require('./activation/activation');

require('./deactivation/deactivation');

require('./destruction/destruction');

var _instance = require('./lib/instance');

var _instance2 = _interopRequireDefault(_instance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _instance2.default;