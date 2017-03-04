'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _relations = require('../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _cacheAssessor = require('./lib/cache-assessor');

var _cacheAssessor2 = _interopRequireDefault(_cacheAssessor);

var _displayer = require('./lib/displayer');

var _displayer2 = _interopRequireDefault(_displayer);

var _instantiator = require('./lib/instantiator');

var _instantiator2 = _interopRequireDefault(_instantiator);

var _renderingPreparer = require('./lib/rendering-preparer');

var _renderingPreparer2 = _interopRequireDefault(_renderingPreparer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootStateName = _vars2.default.rootStateName,
    states = _vars2.default.states;
var activationSequences = states.activationSequences;

exports.default = function (stateParams) {
  stateParams.flags.rendered = true;
  var flags = stateParams.flags,
      beginningStateName = stateParams.beginningStateName;
  var spliced = flags.spliced;


  _lodash2.default.each(activationSequences[stateParams.stateName], function (viewConfigs) {
    var _viewConfigs$record = viewConfigs.record,
        record = _viewConfigs$record === undefined ? {} : _viewConfigs$record,
        main = viewConfigs.main,
        stateName = viewConfigs.stateName;
    var ui = record.ui,
        active = record.active;


    if (_lodash2.default.isEmpty(record)) {
      (0, _renderingPreparer2.default)(viewConfigs);
    }

    if (spliced && active) {
      return;
    }

    if (main && _lodash2.default.isUndefined(beginningStateName)) {
      if (_relations2.default.isRoot(_relations2.default.parent(stateName))) {
        beginningStateName = rootStateName;
      } else {
        beginningStateName = stateName;
      }

      _lodash2.default.extend(stateParams, { beginningStateName: beginningStateName });
    }

    if (_cacheAssessor2.default.total(viewConfigs, stateParams)) {
      if (ui) {
        (0, _displayer2.default)(viewConfigs, stateParams, _cacheAssessor2.default);
      }

      return;
    }

    (0, _instantiator2.default)(viewConfigs, stateParams);
  });

  return stateParams;
};