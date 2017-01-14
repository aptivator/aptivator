import aptivator from '../lib/instance';
import vars      from '../lib/vars';

let statesCache = [];

aptivator.history = {
  add(state) {
    statesCache.push(state);
    statesCache = statesCache.slice(-vars.historySize);
  },
  
  get(start, end) {
    return statesCache.slice(start, end);
  },
  
  size() {
    return statesCache.length;
  },
  
  last() {
    return this.get(-1)[0];
  },
  
  prev() {
    return this.get(-2, -1)[0];
  }
};
