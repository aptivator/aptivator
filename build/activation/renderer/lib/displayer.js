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
exports.default = {
  single: function single(activationRecord, regionInstance) {
    var $el = activationRecord.instance.$el;


    activationRecord.active = true;

    if (activationRecord.detached) {
      activationRecord.detached = false;
      return regionInstance.$el.append($el);
    }

    $el.removeClass(_hideClass2.default);
  },
  multiple: function multiple(params) {
    var _this = this;

    var targetRegion = params.targetRegion,
        regionInstance = params.regionInstance,
        transient = params.transient,
        exclude = params.exclude;


    targetRegion.current.forEach(function (viewAddressUnique) {
      if (exclude.includes(viewAddressUnique)) {
        return;
      }

      var activationRecord = activationRecords[viewAddressUnique];

      if (activationRecord.transient !== transient) {
        return;
      }

      _this.single(activationRecord, regionInstance);
    });
  }
};