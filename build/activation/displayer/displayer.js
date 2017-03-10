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

var _aptivator = require('../../lib/aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

var _displayer = require('../../lib/displayer');

var _displayer2 = _interopRequireDefault(_displayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventHandle = 'aptivator-goto-finalizer';

exports.default = function (stateParams) {
  return new Promise(function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve) {
      var query, renderingStates, renderedStates, stateNames;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              stateParams.flags.displayed = true;
              _aptivator2.default.once(eventHandle, function () {
                return resolve(stateParams);
              });

              query = { flags: { pending: true, rendered: true, displayed: false, canceled: false } };
              renderingStates = _aptivator2.default.history.find(query);

              if (!renderingStates.length) {
                _context.next = 6;
                break;
              }

              return _context.abrupt('return');

            case 6:

              query = { flags: { pending: true, displayed: true, canceled: false } };
              renderedStates = _aptivator2.default.history.find(query);
              stateNames = _lodash2.default.reduce(renderedStates, function (stateNames, stateParams) {
                var stateName = stateParams.stateName,
                    rootViews = stateParams.rootViews,
                    beginningStateName = stateParams.beginningStateName;

                setTimeout(function () {
                  return _lodash2.default.each(rootViews, function (rootView) {
                    return (0, _displayer2.default)(rootView);
                  });
                });
                delete stateParams.rootViews;

                if (beginningStateName) {
                  stateNames.push([beginningStateName, stateName]);
                }

                return stateNames;
              }, []);
              _context.next = 11;
              return (0, _animator2.default)(stateNames, 'enter');

            case 11:

              _aptivator2.default.trigger(eventHandle);

            case 12:
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