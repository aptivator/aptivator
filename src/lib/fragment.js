import _        from 'lodash';
import Backbone from 'backbone';

import {registry, router} from './vars';

export default {
  get: () => Backbone.history.getFragment(),
  
  set: (route, options = {}) => router.navigate(route, options),
  
  toState(fragment = this.get()) {
    return _.filter(registry, (stateConfigs, stateName) => {
      let {abstract, routeRx} = stateConfigs;
      return !abstract && routeRx && routeRx.test(fragment);
    })[0];
  }
};
