'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _receiverClass = require('./receiver-class');

var _receiverClass2 = _interopRequireDefault(_receiverClass);

var _receiversNormalizer = require('./receivers-normalizer');

var _receiversNormalizer2 = _interopRequireDefault(_receiversNormalizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (instance, receivers, params) {
  return _lodash2.default.map((0, _receiversNormalizer2.default)(receivers), function (receiverConfigs, receiver) {
    return new _receiverClass2.default(instance, receiver, receiverConfigs, params);
  });
};