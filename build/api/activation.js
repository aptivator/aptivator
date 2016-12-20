'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../libs/instance');

var _instance2 = _interopRequireDefault(_instance);

var _utils = require('../libs/utils');

var _utils2 = _interopRequireDefault(_utils);

var _initializer = require('./activation/initializer/initializer');

var _initializer2 = _interopRequireDefault(_initializer);

var _preprocessor = require('./activation/preprocessor/preprocessor');

var _preprocessor2 = _interopRequireDefault(_preprocessor);

var _resolver = require('./activation/resolver/resolver');

var _resolver2 = _interopRequireDefault(_resolver);

var _renderer = require('./activation/renderer/renderer');

var _renderer2 = _interopRequireDefault(_renderer);

var _finalizer = require('./activation/finalizer/finalizer');

var _finalizer2 = _interopRequireDefault(_finalizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_instance2.default.activate = function () {
  var stateParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _utils2.default.waterfall([_lodash2.default.partial(_initializer2.default, _lodash2.default, stateParams), _lodash2.default.partial(_preprocessor2.default, _lodash2.default, stateParams), _lodash2.default.partial(_resolver2.default, _lodash2.default, stateParams), _lodash2.default.partial(_renderer2.default, _lodash2.default, stateParams)], _lodash2.default.partial(_finalizer2.default, _lodash2.default, stateParams));
};