'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aptivator = require('../../lib/aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (events, callback, context) {
  _aptivator2.default.on(events, callback, context, true);
};