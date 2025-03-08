import _ from 'lodash';

export default (el, mainProperty) => {
  let computedStyles = window.getComputedStyle(el, null);
  return _.reduce(computedStyles, (aggregator, property) => {
    if(property.startsWith(mainProperty)) {
      aggregator.push(computedStyles[property]);
    }
    return aggregator;
  }, []).join(' ');
};
