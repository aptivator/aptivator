import _               from 'lodash';
import Backbone        from 'backbone';
import aptivator       from '../../lib/instance';
import fragment        from '../../lib/fragment';
import vars            from '../../lib/vars';

export default () => {
  let {defaultState} = vars.configs;

  Backbone.history.start();
  
  if(!fragment.get() && defaultState) {
    aptivator.activate({stateName: defaultState, directParams: {running: true}}).catch(_.noop);
  }
};
