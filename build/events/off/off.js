'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventRegistry = _vars2.default.eventRegistry;

exports.default = function (handle) {
  if (!handle) {
    var events = _lodash2.default.keys(eventRegistry);
    events.forEach(function (event) {
      return delete eventRegistry[event];
    });
  }
};