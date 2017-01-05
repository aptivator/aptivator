'use strict';

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _error = require('../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _initializer = require('./initializer/initializer');

var _initializer2 = _interopRequireDefault(_initializer);

var _preprocessor = require('./preprocessor/preprocessor');

var _preprocessor2 = _interopRequireDefault(_preprocessor);

var _resolver = require('./resolver/resolver');

var _resolver2 = _interopRequireDefault(_resolver);

var _renderer = require('./renderer/renderer');

var _renderer2 = _interopRequireDefault(_renderer);

var _finalizer = require('./finalizer/finalizer');

var _finalizer2 = _interopRequireDefault(_finalizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_instance2.default.activate = function () {
  var stateParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _initializer2.default)(stateParams).then(_preprocessor2.default).then(_resolver2.default).then(_renderer2.default).then(_finalizer2.default).catch(_error2.default.console);
};