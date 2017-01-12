'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hideClass = require('../../../lib/hide-class');

var _hideClass2 = _interopRequireDefault(_hideClass);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var activationRecords = _vars2.default.states.activationRecords;

exports.default = function (params) {
  var targetRegion = params.targetRegion,
      regionInstance = params.regionInstance,
      multiple = params.multiple,
      excludes = params.excludes,
      includes = params.includes;

  targetRegion.current.forEach(function (cacheAddress) {
    if ((excludes || []).includes(cacheAddress)) {
      return;
    }

    if (!multiple && !(includes || []).includes(cacheAddress)) {
      return;
    }

    var activationRecord = activationRecords[cacheAddress];
    var $el = activationRecord.instance.$el;


    activationRecord.active = true;
    $el.removeClass(_hideClass2.default);

    if (activationRecord.detached) {
      activationRecord.detached = false;
      $el.appendTo(regionInstance.$el);
    }
  });
};