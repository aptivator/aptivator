'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hideClass = require('../../../lib/hide-class');

var _hideClass2 = _interopRequireDefault(_hideClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $rootElements = [];

exports.default = {
  single: function single(activationRecord, $regionEl) {
    var $el = activationRecord.instance.$el;


    activationRecord.active = true;

    if (!activationRecord.detached) {
      return $el.removeClass(_hideClass2.default);
    }

    activationRecord.detached = false;
    $regionEl.append($el);
  },


  roots: {
    add: function add($el) {
      $rootElements.push($el.addClass(_hideClass2.default));
    },
    display: function display() {
      $rootElements.forEach(function ($el) {
        return $el.removeClass(_hideClass2.default);
      });
      $rootElements = [];
    }
  }
};