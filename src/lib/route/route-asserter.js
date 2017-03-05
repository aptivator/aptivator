import _ from 'lodash';

export default (values, asserters) => {
  for(let [index, value] of values.entries()) {
    let asserter = asserters[index];
    
    if(!asserter) {
      continue;
    }
    
    if(_.isRegExp(asserter)) {
      if(!asserter.test(value)) {
        return;
      }
    }
  }
  
  return true;
};
