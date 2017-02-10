'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _error = require('../lib/error');

var _error2 = _interopRequireDefault(_error);

var _vars = require('../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var states = _vars2.default.states,
    spaceSplitter = _vars2.default.spaceSplitter;
var activationRecords = states.activationRecords,
    registry = states.registry;


var animationHandle = 'animationend transitionend';

var _class = function () {
  function _class(states, type) {
    (0, _classCallCheck3.default)(this, _class);

    _lodash2.default.extend(this, { states: states, type: type });
    this.prepare();
  }

  (0, _createClass3.default)(_class, [{
    key: 'prepare',
    value: function prepare() {
      var _this = this;

      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this,
          states = _ref.states;

      if (states !== this.states) {
        _lodash2.default.extend(this, { states: states });
      }

      this.animations = states.reduce(function (animations, stateParams) {
        var animate = registry[stateParams.stateName].animate;

        var _ref2 = animate || {},
            animationsMap = _ref2[_this.type];

        _lodash2.default.each(animationsMap, function (classNames, stateName) {
          var _classes;

          var stateConfigs = registry[stateName];

          var _ref3 = stateConfigs || {},
              viewAddressUnique = _ref3.viewAddressUnique;

          var activationRecord = activationRecords[viewAddressUnique];

          if (!stateConfigs) {
            return _error2.default.warn('state [' + stateName + '] does not exist', 'animator');
          }

          if (!(viewAddressUnique && activationRecord && activationRecord.active)) {
            return _error2.default.warn('state [' + stateName + '] is not activated', 'animator');
          }

          var stateAnimations = animations[stateName] || (animations[stateName] = {});
          var $el = stateAnimations.$el,
              classes = stateAnimations.classes;


          if (!$el) {
            $el = activationRecord.instance.$el;

            classes = new Set();
            _lodash2.default.extend(stateAnimations, { $el: $el, classes: classes });
          }

          (_classes = classes).add.apply(_classes, (0, _toConsumableArray3.default)(classNames.trim().split(spaceSplitter)));
        });

        return animations;
      }, {});
    }
  }, {
    key: 'animate',
    value: function animate() {
      var promises = [];

      _lodash2.default.each(this.animations, function (animationConfigs) {
        var $el = animationConfigs.$el,
            classes = animationConfigs.classes;

        var promise = new Promise(function (resolve) {
          $el.one(animationHandle, function () {
            $el.removeClass.apply($el, (0, _toConsumableArray3.default)(classes));
            resolve();
          });
        });
        $el.addClass.apply($el, (0, _toConsumableArray3.default)(classes));
        promises.push(promise);
      });

      return Promise.all(promises);
    }
  }]);
  return _class;
}();

exports.default = _class;