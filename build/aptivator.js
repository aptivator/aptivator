'use strict';

require('./history/history');

require('./events/events');

require('./storage/storage');

require('./config/config');

require('./state/state');

require('./start/start');

require('./activation/activation');

require('./deactivation/deactivation');

require('./destruction/destruction');

var _aptivator = require('./lib/aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _aptivator2.default;