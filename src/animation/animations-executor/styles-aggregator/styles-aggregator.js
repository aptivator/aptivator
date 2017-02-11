import _ from 'lodash';

export default (el, mainStyle) => {
  let computedStyles = window.getComputedStyle(el, null);
  return _.reduce(computedStyles, (accumulator, value) => {
    if(value.startsWith(mainStyle)) {
      accumulator.push(computedStyles[value]);
    }
    return accumulator;
  }, []).join(' ');
};
