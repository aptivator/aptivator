import _        from 'underscore';
import Backbone from 'backbone';
import vars     from './vars';

export default {
  get: () => Backbone.history.fragment,
  
  set: (route, options = {}) => vars.router.navigate(route, options),
  
  toState(fragment = this.get()) {
    return _.keys(vars.states.registry).filter(stateName => {
      let routeRx = vars.states.registry[stateName].routeRx;
      return routeRx && routeRx.test(fragment);
    })[0];
  }
};
