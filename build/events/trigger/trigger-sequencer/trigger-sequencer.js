'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _depthFinder = require('./lib/depth-finder');

var _depthFinder2 = _interopRequireDefault(_depthFinder);

var _triggerSequencer = require('./lib/trigger-sequencer');

var _triggerSequencer2 = _interopRequireDefault(_triggerSequencer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (events, mainArgs) {
  var triggerSequence = (0, _triggerSequencer2.default)(events, mainArgs);
  triggerSequence = _lodash2.default.uniqWith(triggerSequence, _lodash2.default.isEqual);
  return triggerSequence.sort(function () {
    return (0, _depthFinder2.default)(arguments.length <= 0 ? undefined : arguments[0]) - (0, _depthFinder2.default)(arguments.length <= 1 ? undefined : arguments[1]);
  });
};