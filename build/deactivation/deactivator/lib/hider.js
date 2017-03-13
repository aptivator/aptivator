'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _hideClass = require('../../../lib/hide-class');

var _hideClass2 = _interopRequireDefault(_hideClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (record, detach) {
  var active = record.active,
      _record$instance = record.instance,
      instance = _record$instance === undefined ? {} : _record$instance;
  var $el = instance.$el;


  if (!active && !detach || !$el) {
    return;
  }

  if (!detach) {
    detach = record.detach;
  }

  _lodash2.default.extend(record, { active: false, detached: detach });

  if (detach) {
    return $el.removeClass(_hideClass2.default).detach();
  }

  $el.addClass(_hideClass2.default);
};