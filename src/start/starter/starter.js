import _               from 'lodash';
import Backbone        from 'backbone';
import aptivator       from '../../lib/instance';
import fragment        from '../../lib/fragment';
import vars            from '../../lib/vars';

export default async () => {
  let {defaultState} = vars.configs;

  Backbone.history.start();
  /*
  aptivator.activate({name: 'app-1'});
  aptivator.activate({name: 'app-2.form', route: {params: {one: '1'}}, flags: {parallel: true, weave: true}});
  aptivator.activate({name: 'app-2.info', flags: {parallel: true, weave: true}});
  */
  
  
  if(!fragment.get() && defaultState) {
    aptivator.activate({stateName: defaultState, direct: {running: true}}).catch(_.noop);
  }
};
