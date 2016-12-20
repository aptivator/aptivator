"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  clone: function clone(o) {
    return JSON.parse(JSON.stringify(o));
  },

  waterfall: function waterfall(funcs, callback) {
    return !function waterfall() {
      for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
      }

      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      funcs[index].apply(funcs, [function (error) {
        for (var _len2 = arguments.length, rest = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          rest[_key2 - 1] = arguments[_key2];
        }

        return error ? callback(error) : ++index < funcs.length ? waterfall.apply(undefined, [index].concat(rest)) : callback.apply(undefined, [null].concat(rest));
      }].concat(rest));
    }();
  }
};