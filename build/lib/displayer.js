'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _hideClass = require('./hide-class');

var _hideClass2 = _interopRequireDefault(_hideClass);

var _vars = require('./vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var activationRecords = _vars2.default.states.activationRecords;
exports.default = {
  display: function display(viewAddressUnique, $regionEl) {
    var activationRecord = activationRecords[viewAddressUnique];
    var detached = activationRecord.detached,
        instance = activationRecord.instance;


    if (!instance.isRendered) {
      instance.render();
    }

    var $el = instance.$el;


    activationRecord.active = true;

    if (!detached) {
      return $el.removeClass(_hideClass2.default);
    }

    activationRecord.detached = false;
    $regionEl.append($el);
  },
  hide: function hide(viewAddressUnique, detach) {
    var activationRecord = activationRecords[viewAddressUnique];
    var $el = activationRecord.instance.$el;


    if (!detach) {
      detach = activationRecord.detach;
    }

    _lodash2.default.extend(activationRecord, { active: false, detached: detach });

    if (detach) {
      return $el.removeClass(_hideClass2.default).detach();
    }

    $el.addClass(_hideClass2.default);
  }
};