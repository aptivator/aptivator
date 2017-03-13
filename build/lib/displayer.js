'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hideClass = require('./hide-class');

var _hideClass2 = _interopRequireDefault(_hideClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (viewConfigs) {
  var record = viewConfigs.record,
      parentRecord = viewConfigs.parentRecord,
      addressSelector = viewConfigs.addressSelector;
  var detached = record.detached,
      _record$instance = record.instance,
      instance = _record$instance === undefined ? {} : _record$instance;
  var $el = instance.$el;


  if (!$el) {
    return;
  }

  record.active = true;

  $el.removeClass(_hideClass2.default);

  if (!detached) {
    return;
  }

  var $parentEl = parentRecord.instance.$el;

  var $regionEl = !addressSelector ? $parentEl : $parentEl.find(addressSelector).eq(0);

  record.detached = false;
  $regionEl.append($el);
};