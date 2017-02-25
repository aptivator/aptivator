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
      instance = record.instance;
  var $el = instance.$el;


  record.active = true;

  if (!detached) {
    return $el.removeClass(_hideClass2.default);
  }

  var $parentEl = parentRecord.instance.$el;

  var $regionEl = !addressSelector ? $parentEl : $parentEl.find(addressSelector).eq(0);

  record.detached = false;
  $regionEl.append($el);
};