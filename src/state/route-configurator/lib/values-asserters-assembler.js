import _     from 'lodash';
import error from '../../../lib/error';

export default (route, parentRoute) => {
  let {params = {}, parts, allValues} = route;
  let {values: parentValues = [], allValues: parentAllValues, asserters: parentAsserters = []} = parentRoute;
  let {values, asserters} = _.reduce(parts, (aggregator, part) => {
    let {name, required} = part;
    let param = params[name] || {};
    let {values, asserters} = aggregator;
    
    if(!_.isUndefined(required)) {
      values.push(param.value);
      asserters.push(param.asserter);
    }
    
    return aggregator;
  }, {asserters: [], values: []});
  
  if(_.isEmpty(parentRoute)) {
    parentAllValues = true;
  }
  
  values = _.compact(values);
  
  if(values.length && !parentAllValues) {
    error.throw('to assemble child values provide all parent values', 'routing');
  }
  
  if(!_.compact(asserters).length) {
    asserters = [];
  }
  
  if(values.length === _.keys(params).length) {
    allValues = true;
  }
  
  _.extend(route, {
    values: parentValues.concat(values), allValues,
    asserters: parentAsserters.concat(asserters)
  });
};
