'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _animator = require('../../animation/animator');

var _animator2 = _interopRequireDefault(_animator);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _displayer = require('../../lib/displayer');

var _displayer2 = _interopRequireDefault(_displayer);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var activating = _vars2.default.activating;

var eventHandle = 'aptivator-goto-finalizer';

exports.default = function (stateParams) {
  return new Promise(function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve) {
      var query, renderingStates, renderedStates, transient, tracker, stateNames;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:

              stateParams.flags.displayed = true;
              _instance2.default.once(eventHandle, function () {
                return resolve(stateParams);
              });

              query = { flags: { pending: true, rendered: true, displayed: false, canceled: false } };
              renderingStates = _instance2.default.history.find(query);

              if (!renderingStates.length) {
                _context.next = 6;
                break;
              }

              return _context.abrupt('return');

            case 6:

              query = { flags: { pending: true, displayed: true, canceled: false } };
              renderedStates = _instance2.default.history.find(query);
              transient = stateParams.flags.transient;
              tracker = activating[transient ? 'transient' : 'regular'];
              stateNames = _lodash2.default.map(renderedStates, function (stateParams) {
                var stateName = stateParams.stateName,
                    rootViews = stateParams.rootViews;

                _lodash2.default.each(rootViews, function (rootView) {
                  return (0, _displayer2.default)(rootView);
                });
                delete stateParams.rootViews;
                return stateName;
              });
              _context.next = 13;
              return (0, _animator2.default)(stateNames, 'enter');

            case 13:

              _lodash2.default.remove(tracker, function () {
                return true;
              });
              _instance2.default.trigger(eventHandle);

            case 15:
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