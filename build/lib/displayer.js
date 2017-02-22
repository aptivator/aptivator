'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hideClass = require('./hide-class');

var _hideClass2 = _interopRequireDefault(_hideClass);

var _vars = require('./vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var activationRecords = _vars2.default.states.activationRecords;

exports.default = function (uniqueAddress, $regionEl) {
  var activationRecord = activationRecords[uniqueAddress];
  var detached = activationRecord.detached,
      instance = activationRecord.instance;
  var $el = instance.$el;


  activationRecord.active = true;

  if (!detached) {
    return $el.removeClass(_hideClass2.default);
  }

  activationRecord.detached = false;
  $regionEl.append($el);
};