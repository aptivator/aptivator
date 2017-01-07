'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _storageActionGenerator = require('./lib/storage-action-generator');

var _storageActionGenerator2 = _interopRequireDefault(_storageActionGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_instance2.default.m = new Map();

_lodash2.default.each({ l: localStorage, s: sessionStorage }, function (store, storeAbbr) {
  _instance2.default[storeAbbr] = {
    get: (0, _storageActionGenerator2.default)(store),
    set: (0, _storageActionGenerator2.default)(store, true)
  };
});