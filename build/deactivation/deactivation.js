'use strict';

var _instance = require('../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _error = require('../lib/error');

var _error2 = _interopRequireDefault(_error);

var _deactivator = require('./lib/deactivator');

var _deactivator2 = _interopRequireDefault(_deactivator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_instance2.default.deactivate = function (params) {
  var forward = params.forward,
      focal = params.focal;


  if (forward && focal) {
    _error2.default.throw('use either [focal] or [forward] flag', 'deactivator');
  }

  if (focal || forward) {
    return _deactivator2.default.partial(params);
  }

  _deactivator2.default.full(params);
};