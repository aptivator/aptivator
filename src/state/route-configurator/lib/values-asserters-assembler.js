import _     from 'lodash';
import error from '../../../lib/error';

export default (route, parentRoute) => {
  let {params = {}, parts, allValues, values: routeValues, asserters: routeAsserters} = route;
  let {values: parentValues = [], allValues: parentAllValues, asserters: parentAsserters = []} = parentRoute;
  let index = -1;
  let {values, asserters} = _.reduce(parts, (aggregator, part) => {
    let {name, required} = part;
    let param = params[name] || {};
    let {values, asserters} = aggregator;
    
    if(!_.isUndefined(required)) {
      values.push(routeValues ? routeValues[++index] : param.value);
      asserters.push(routeAsserters ? routeAsserters[index] : param.asserter);
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
    allValues,
    values: parentValues.concat(values),
    asserters: parentAsserters.concat(asserters)
  });
};
