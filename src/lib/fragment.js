import _        from 'lodash';
import Backbone from 'backbone';
import vars     from './vars';

export default {
  get: () => Backbone.history.getFragment(),
  
  set: (route, options = {}) => vars.router.navigate(route, options),
  
  toState(fragment = this.get()) {
    return _.filter(vars.states.registry, (stateConfigs, stateName) => {
      let {abstract, routeRx} = stateConfigs;
      return !abstract && routeRx && routeRx.test(fragment);
    })[0];
  }
};
