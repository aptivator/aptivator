'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _backbone = require('backbone');

var _backbone2 = _interopRequireDefault(_backbone);

var _vars = require('./vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  get: function get() {
    return _backbone2.default.history.fragment;
  },

  set: function set(route) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return _vars2.default.router.navigate(route, options);
  },

  toState: function toState() {
    var fragment = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.get();

    return _lodash2.default.keys(_vars2.default.states.registry).filter(function (stateName) {
      var routeRx = _vars2.default.states.registry[stateName].routeRx;
      return routeRx && routeRx.test(fragment);
    })[0];
  }
};