'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _vars = require('../../../libs/vars');

var _vars2 = _interopRequireDefault(_vars);

var _hideClass = require('./hide-class');

var _hideClass2 = _interopRequireDefault(_hideClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var activationRecords = _vars2.default.states.activationRecords;


var remover = {
  destroy: function destroy(cacheAddress) {
    var activationRecord = activationRecords[cacheAddress];
    console.log('destroying ' + cacheAddress);
    _lodash2.default.each(activationRecord.regions, function (targetRegion) {
      return remover.hide({ targetRegion: targetRegion, detach: true });
    });
    activationRecord.instance.destroy();
  },

  hide: function hide(params) {
    var targetRegion = params.targetRegion,
        cacheAddress = params.cacheAddress,
        detach = params.detach;

    var record = activationRecords[targetRegion.current];
    var $el = record.instance.$el;


    if (_lodash2.default.isBoolean(detach)) {
      record.detached = detach;
    } else {
      detach = record.detached;
    }

    var operation = detach ? 'detach' : 'addClass';
    var parameter = detach ? null : _hideClass2.default;

    if (targetRegion.current !== cacheAddress) {
      console.log('hiding ' + targetRegion.current, operation);
      $el[operation](parameter);
    }

    if (detach && $el.hasClass(_hideClass2.default)) {
      $el.removeClass(_hideClass2.default);
    }

    _lodash2.default.each(record.regions, function (targetRegion) {
      return remover.hide({ targetRegion: targetRegion });
    });
  }
};

exports.default = remover;