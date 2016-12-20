import aptivator from './instance';
import vars      from './vars';

aptivator.history = {
  states: [],
  
  set(state) {
    this.states.push(state);
    this.states = this.states.slice(-vars.historySize);
  },
  
  get(start, end) {
    return this.states.slice(start, end);
  },
  
  size() {
    return this.states.length;
  },
  
  last() {
    return this.get(-1)[0];
  },
  
  prev() {
    return this.get(-2, -1)[0];
  }
};
