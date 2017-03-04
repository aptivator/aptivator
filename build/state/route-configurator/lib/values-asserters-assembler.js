'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _error = require('../../../lib/error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (route, parentRoute) {
  var _route$params = route.params,
      params = _route$params === undefined ? {} : _route$params,
      parts = route.parts,
      allValues = route.allValues;
  var _parentRoute$values = parentRoute.values,
      parentValues = _parentRoute$values === undefined ? [] : _parentRoute$values,
      parentAllValues = parentRoute.allValues,
      _parentRoute$asserter = parentRoute.asserters,
      parentAsserters = _parentRoute$asserter === undefined ? [] : _parentRoute$asserter;

  var _$reduce = _lodash2.default.reduce(parts, function (aggregator, part) {
    var name = part.name,
        required = part.required;

    var param = params[name] || {};
    var values = aggregator.values,
        asserters = aggregator.asserters;


    if (!_lodash2.default.isUndefined(required)) {
      values.push(param.value);
      asserters.push(param.asserter);
    }

    return aggregator;
  }, { asserters: [], values: [] }),
      values = _$reduce.values,
      asserters = _$reduce.asserters;

  if (_lodash2.default.isEmpty(parentRoute)) {
    parentAllValues = true;
  }

  values = _lodash2.default.compact(values);

  if (values.length && !parentAllValues) {
    _error2.default.throw('to assemble child values provide all parent values', 'routing');
  }

  if (!_lodash2.default.compact(asserters).length) {
    asserters = [];
  }

  if (values.length === _lodash2.default.keys(params).length) {
    allValues = true;
  }

  _lodash2.default.extend(route, {
    values: parentValues.concat(values), allValues: allValues,
    asserters: parentAsserters.concat(asserters)
  });
};