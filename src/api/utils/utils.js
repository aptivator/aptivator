import aptivator from '../../lib/instance';
import error     from '../../lib/error';
import route     from '../../lib/route';
import vars      from '../../lib/vars';

let {registry} = vars.states;

aptivator.href = (stateName, ...routeValues) => {
  let state = registry[stateName];
  
  if(!state) {
    error.throw(`state [${stateName}] does not exist`);
  }
  
  if(!state.route) {
    error.throw(`state [${stateName}] does not have a route`);
  }
  
  return `#${route.params.assemble(stateName, routeValues).fragment}`;
};

let storageAction = (storage, setter) => 
  setter ? (key, val) => storage.setItem(key, JSON.stringify(val)) :
    (key, val) => (val = storage.getItem(key), val ? JSON.parse(val) : val);

aptivator.m = new Map();

aptivator.s = {
  get: storageAction(sessionStorage),
  set: storageAction(sessionStorage, true)
};

aptivator.l = {
  get: storageAction(localStorage),
  set: storageAction(localStorage, true)
};

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
