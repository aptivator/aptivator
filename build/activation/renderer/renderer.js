'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _canceler = require('../canceler/canceler');

var _canceler2 = _interopRequireDefault(_canceler);

var _cacheAssessor = require('./lib/cache-assessor');

var _cacheAssessor2 = _interopRequireDefault(_cacheAssessor);

var _displayer = require('./lib/displayer');

var _displayer2 = _interopRequireDefault(_displayer);

var _instantiator = require('./lib/instantiator');

var _instantiator2 = _interopRequireDefault(_instantiator);

var _renderingPreparer = require('./lib/rendering-preparer');

var _renderingPreparer2 = _interopRequireDefault(_renderingPreparer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var activationSequences = _vars2.default.states.activationSequences;

exports.default = function (stateParams) {
  (0, _canceler2.default)(stateParams);
  stateParams.flags.rendered = true;
  var augment = stateParams.flags.augment;


  _lodash2.default.each(activationSequences[stateParams.stateName], function (viewConfigs) {
    if (!viewConfigs.record) {
      (0, _renderingPreparer2.default)(viewConfigs);
    }

    if (augment && viewConfigs.record.active) {
      return;
    }

    if (_cacheAssessor2.default.total(viewConfigs, stateParams)) {
      return (0, _displayer2.default)(viewConfigs, stateParams, _cacheAssessor2.default);
    }

    (0, _instantiator2.default)(viewConfigs, stateParams);
  });

  return stateParams;
};