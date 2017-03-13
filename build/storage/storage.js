'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _aptivator = require('../lib/aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

var _storageActionGenerator = require('./lib/storage-action-generator');

var _storageActionGenerator2 = _interopRequireDefault(_storageActionGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_aptivator2.default.m = new Map();

_lodash2.default.each({ l: localStorage, s: sessionStorage }, function (store, storeAbbr) {
  _aptivator2.default[storeAbbr] = {
    get: (0, _storageActionGenerator2.default)(store),
    set: (0, _storageActionGenerator2.default)(store, true)
  };
});