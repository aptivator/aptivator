'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('../../../libs/utils');

var _utils2 = _interopRequireDefault(_utils);

var _stateResolvesProcessor = require('./state-resolves-processor');

var _stateResolvesProcessor2 = _interopRequireDefault(_stateResolvesProcessor);

var _viewResolvesProcessor = require('./view-resolves-processor');

var _viewResolvesProcessor2 = _interopRequireDefault(_viewResolvesProcessor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (callback, p) {
  _utils2.default.waterfall([_lodash2.default.partial(_stateResolvesProcessor2.default, _lodash2.default, p), _lodash2.default.partial(_viewResolvesProcessor2.default, _lodash2.default, p)], callback);
};