import _        from 'lodash';
import Backbone from 'backbone';
import vars     from './vars';

export default {
  get: () => Backbone.history.getFragment(),
  
  set: (route, options = {}) => vars.router.navigate(route, options),
  
  toState(fragment = this.get()) {
    return _.keys(vars.states.registry).filter(stateName => {
      let stateConfigs = vars.states.registry[stateName];
      let routeRx = stateConfigs.routeRx;
      return !stateConfigs.abstract && routeRx && routeRx.test(fragment);
    })[0];
  }
};
