'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _aptivator = require('../lib/aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

var _canceler = require('./canceler/canceler');

var _canceler2 = _interopRequireDefault(_canceler);

var _eventer = require('./eventer/eventer');

var _eventer2 = _interopRequireDefault(_eventer);

var _initializer = require('./initializer/initializer');

var _initializer2 = _interopRequireDefault(_initializer);

var _preprocessor = require('./preprocessor/preprocessor');

var _preprocessor2 = _interopRequireDefault(_preprocessor);

var _starter = require('./starter/starter');

var _starter2 = _interopRequireDefault(_starter);

var _resolver = require('./resolver/resolver');

var _resolver2 = _interopRequireDefault(_resolver);

var _deactivator = require('./deactivator/deactivator');

var _deactivator2 = _interopRequireDefault(_deactivator);

var _renderer = require('./renderer/renderer');

var _renderer2 = _interopRequireDefault(_renderer);

var _connector = require('./connector/connector');

var _connector2 = _interopRequireDefault(_connector);

var _displayer = require('./displayer/displayer');

var _displayer2 = _interopRequireDefault(_displayer);

var _finalizer = require('./finalizer/finalizer');

var _finalizer2 = _interopRequireDefault(_finalizer);

var _errorer = require('../errorer/errorer');

var _errorer2 = _interopRequireDefault(_errorer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var processes = [_initializer2.default, (0, _eventer2.default)('start'), _preprocessor2.default, _resolver2.default, (0, _eventer2.default)('loading'), _deactivator2.default, _renderer2.default, _connector2.default, _displayer2.default, (0, _eventer2.default)('loaded'), _finalizer2.default, (0, _eventer2.default)('enter')];

processes = processes.map(function (process) {
  return function (stateParams) {
    if (!stateParams) {
      return;
    }

    if ((0, _canceler2.default)(stateParams)) {
      return;
    }

    return process(stateParams);
  };
});

_aptivator2.default.activate = function (stateParams) {
  var promise = (0, _starter2.default)(stateParams);
  _lodash2.default.each(processes, function (process) {
    return promise = promise.then(process);
  });
  return promise.catch(_errorer2.default);
};