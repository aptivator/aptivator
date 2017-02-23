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
  aptivator.activate({name: 'app-2.form', flags: {parallel: true}});
  aptivator.activate({name: 'app-2.info', flags: {parallel: true}});

  setTimeout(() => {
    aptivator.deactivate({name: 'app-2.form'});
    aptivator.deactivate({name: 'app-2.info'});
  }, 5000);
  
  */
  
  if(!fragment.get() && defaultState) {
    aptivator.activate({stateName: defaultState, direct: {running: true}}).catch(_.noop);
  }
  
};
