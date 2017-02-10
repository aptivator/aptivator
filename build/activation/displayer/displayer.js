'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _animator = require('../../animation/animator');

var _animator2 = _interopRequireDefault(_animator);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _displayer = require('../../lib/displayer');

var _displayer2 = _interopRequireDefault(_displayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventHandle = 'aptivator-goto-finalizer';

exports.default = function (stateParams) {
  return new Promise(function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve) {
      var query, renderingStates, renderedStates, animator;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              stateParams.flags.displayed = true;

              _instance2.default.once(eventHandle, function () {
                return resolve(stateParams);
              });

              query = { flags: { rendered: true, displayed: false, canceled: false } };
              renderingStates = _instance2.default.history.find(query);

              if (!renderingStates.length) {
                _context.next = 6;
                break;
              }

              return _context.abrupt('return');

            case 6:

              query = { flags: { pending: true, displayed: true, canceled: false } };
              renderedStates = _instance2.default.history.find(query);


              renderedStates.forEach(function (stateParams) {
                var rootViews = stateParams.rootViews;

                rootViews.forEach(function (rootView) {
                  return _displayer2.default.apply(undefined, (0, _toConsumableArray3.default)(rootView));
                });
                delete stateParams.rootViews;
              });

              animator = new _animator2.default(renderedStates, 'enter');
              _context.next = 12;
              return animator.animate();

            case 12:

              _instance2.default.trigger(eventHandle);

            case 13:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
};