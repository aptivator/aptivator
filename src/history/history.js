import aptivator   from '../lib/instance';
import statesCache from './lib/states-cache';

aptivator.history = {
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
