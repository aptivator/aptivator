import _           from 'lodash';
import aptivator   from '../lib/instance';
import vars        from '../lib/vars';

let {history} = vars.states;

aptivator.history = {
  find(predicate) {
    return _.filter(history, predicate).reverse();
  },
  
  findOne(predicate) {
    return this.find(predicate)[0];
  }
};
