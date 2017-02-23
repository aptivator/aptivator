'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _hideClass = require('../../../lib/hide-class');

var _hideClass2 = _interopRequireDefault(_hideClass);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var activationRecords = _vars2.default.states.activationRecords;

exports.default = function (uniqueAddress, detach) {
  var activationRecord = activationRecords[uniqueAddress];

  var _ref = activationRecord || {},
      instance = _ref.instance;

  if (!(activationRecord && instance)) {
    return;
  }

  var $el = instance.$el;


  if (!detach) {
    detach = activationRecord.detach;
  }

  _lodash2.default.extend(activationRecord, { active: false, detached: detach });

  if (detach) {
    return $el.removeClass(_hideClass2.default).detach();
  }

  $el.addClass(_hideClass2.default);
};