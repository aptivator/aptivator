'use strict';

require('./libs/storage');

require('./api/setup/setup');

require('./api/start/start');

require('./api/utils/utils');

require('./api/activation/activation');

require('./api/deactivation/deactivation');

var _instance = require('./libs/instance');

var _instance2 = _interopRequireDefault(_instance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _instance2.default;