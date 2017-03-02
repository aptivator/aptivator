'use strict';

var _aptivator = require('../lib/aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

var _errorer = require('../errorer/errorer');

var _errorer2 = _interopRequireDefault(_errorer);

var _starter = require('./starter/starter');

var _starter2 = _interopRequireDefault(_starter);

var _deactivator = require('./deactivator/deactivator');

var _deactivator2 = _interopRequireDefault(_deactivator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_aptivator2.default.deactivate = function (params) {
  return (0, _starter2.default)(params).then(_deactivator2.default).catch(_errorer2.default);
};