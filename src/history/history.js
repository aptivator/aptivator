import aptivator   from '../lib/instance';
import vars        from '../lib/vars';

let {history} = vars.states;

aptivator.history = {
  get(filterer) {
    return history.filter(filterer).reverse();
  },
  
  getOne(filterer) {
    return this.get(filterer)[0];
  }
};
