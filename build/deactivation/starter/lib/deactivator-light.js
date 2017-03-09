'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = deactivator;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function deactivator(statesParams) {
  _lodash2.default.each(statesParams, function (stateParams) {
    var flags = stateParams.flags,
        parallels = stateParams.parallels;

    _lodash2.default.extend(flags, { active: false });
    deactivator(parallels);
  });
}