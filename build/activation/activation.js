'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _initializer = require('./initializer/initializer');

var _initializer2 = _interopRequireDefault(_initializer);

var _preprocessor = require('./preprocessor/preprocessor');

var _preprocessor2 = _interopRequireDefault(_preprocessor);

var _historian = require('./historian/historian');

var _historian2 = _interopRequireDefault(_historian);

var _resolver = require('./resolver/resolver');

var _resolver2 = _interopRequireDefault(_resolver);

var _deactivator = require('./deactivator/deactivator');

var _deactivator2 = _interopRequireDefault(_deactivator);

var _renderer = require('./renderer/renderer');

var _renderer2 = _interopRequireDefault(_renderer);

var _finalizer = require('./finalizer/finalizer');

var _finalizer2 = _interopRequireDefault(_finalizer);

var _errorer = require('./errorer/errorer');

var _errorer2 = _interopRequireDefault(_errorer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_instance2.default.activate = function (stateParams) {
  return (0, _initializer2.default)(stateParams).then(_preprocessor2.default).then(_historian2.default).then(_resolver2.default).then(_deactivator2.default).then(_renderer2.default).then(_finalizer2.default).catch(_lodash2.default.partial(_errorer2.default, _lodash2.default, stateParams));
};