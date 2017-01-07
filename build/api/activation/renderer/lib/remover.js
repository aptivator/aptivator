'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _vars = require('../../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _hideClass = require('./hide-class');

var _hideClass2 = _interopRequireDefault(_hideClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  destroy: function destroy(activationRecord, multiple) {
    var _this = this;

    if (!multiple) {
      _lodash2.default.each(activationRecord.regions, function (targetRegion) {
        return _this.hide({ targetRegion: targetRegion, detach: true });
      });
    }
    activationRecord.instance.destroy();
  },
  hide: function hide(params) {
    var _this2 = this;

    var targetRegion = params.targetRegion,
        cacheAddress = params.cacheAddress,
        detach = params.detach;

    targetRegion.current.forEach(function (entityName) {
      var record = _vars2.default.states.activationRecords[entityName];
      var $el = record.instance.$el;


      if (detach) {
        record.detached = detach;
      } else {
        detach = record.detached;
      }

      if (!targetRegion.current.has(cacheAddress)) {
        var operation = detach ? 'detach' : 'addClass';
        var parameter = detach ? null : _hideClass2.default;
        $el[operation](parameter);
      }

      if (detach && $el.hasClass(_hideClass2.default)) {
        $el.removeClass(_hideClass2.default);
      }

      if (!_lodash2.default.isUndefined(cacheAddress)) {
        targetRegion.current.delete(entityName);
      }

      _lodash2.default.each(record.regions, function (targetRegion) {
        return _this2.hide({ targetRegion: targetRegion });
      });
    });
  }
};