'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _aptivator = require('../lib/aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

var _vars = require('../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var history = _vars2.default.states.history;


_aptivator2.default.history = {
  find: function find(predicate) {
    return _lodash2.default.filter(history, predicate).reverse();
  },
  findOne: function findOne(predicate) {
    return this.find(predicate)[0];
  }
};