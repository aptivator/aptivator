'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _displayer = require('../../lib/displayer');

var _displayer2 = _interopRequireDefault(_displayer);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var activationRecords = _vars2.default.states.activationRecords;

var eventHandle = 'aptivator-goto-finalizer';
var animationHandle = 'animationend transitionend';

exports.default = function (stateParams) {
  return new Promise(function (resolve) {
    stateParams.flags.displayed = true;

    _instance2.default.once(eventHandle, function () {
      return resolve(stateParams);
    });

    var query = { flags: { rendered: true, displayed: false, canceled: false } };
    var renderingStates = _instance2.default.history.find(query);

    if (renderingStates.length) {
      return;
    }

    query = { flags: { pending: true, displayed: true, canceled: false } };
    var renderedStates = _instance2.default.history.find(query);

    var $rootEl = activationRecords[_vars2.default.rootStateName].instance.$el;

    $rootEl.addClass('aptivator-fade-in');

    $rootEl.one(animationHandle, function () {
      return $rootEl.removeClass('aptivator-fade-in');
    });

    renderedStates.forEach(function (stateParams) {
      var rootViews = stateParams.rootViews;

      rootViews.forEach(function (rootView) {
        return _displayer2.default.apply(undefined, (0, _toConsumableArray3.default)(rootView));
      });
      delete stateParams.rootViews;
    });

    _instance2.default.trigger(eventHandle);
  });
};