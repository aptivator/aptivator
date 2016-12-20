'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = viewsDisplayer;

var _addresser = require('../../../../libs/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _vars = require('../../../../libs/vars');

var _vars2 = _interopRequireDefault(_vars);

var _hideClass = require('./hide-class');

var _hideClass2 = _interopRequireDefault(_hideClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var activationRecords = _vars2.default.states.activationRecords;
function viewsDisplayer(params) {
  var cacheAddresses = params.cacheAddresses,
      regionInstance = params.regionInstance,
      excludes = params.excludes,
      viewsRegistry = params.viewsRegistry;

  cacheAddresses.forEach(function (cacheAddress) {
    if (excludes && excludes.includes(cacheAddress)) {
      return;
    }

    var activationRecord = activationRecords[cacheAddress];

    if (activationRecord.detached) {
      regionInstance.$el.append(activationRecord.instance.$el);
    } else if (activationRecord.instance.$el.hasClass(_hideClass2.default)) {
      activationRecord.instance.$el.removeClass(_hideClass2.default);
    }

    if (activationRecord.immediates) {
      activationRecord.immediates.forEach(function (cacheAddress) {
        if (viewsRegistry && viewsRegistry[cacheAddress]) {
          return;
        }

        var regionName = _addresser2.default.region(cacheAddress);
        var regionInstance = activationRecord.instance[regionName];
        viewsDisplayer({ cacheAddresses: [cacheAddress], regionInstance: regionInstance });
      });
    }
  });
}