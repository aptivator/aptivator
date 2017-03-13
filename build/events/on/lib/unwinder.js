'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _aptivator = require('../../../lib/aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (eventsConfigs, handlePartsBase, once) {
  _lodash2.default.each(eventsConfigs, function (configs, eventName) {
    var callbacks = configs.callbacks;

    var handleParts = handlePartsBase.concat(eventName);

    if (_lodash2.default.isArray(configs)) {
      callbacks = configs;
    } else if (_lodash2.default.isFunction(configs) || _lodash2.default.has(configs, 'callback')) {
      callbacks = [configs];
    } else if (_lodash2.default.isFunction(callbacks) || _lodash2.default.has(callbacks, 'callback')) {
      callbacks = [callbacks];
    }

    if (callbacks) {
      var handleName = handleParts.join(':');
      _aptivator2.default.on(handleName, callbacks, null, once);
    }

    if (_lodash2.default.isPlainObject(configs)) {
      var childrenConfigs = _lodash2.default.omit(configs, 'callbacks');
      if (!_lodash2.default.isEmpty(childrenConfigs)) {
        _aptivator2.default.on(childrenConfigs, handleParts, null, once);
      }
    }
  });
};