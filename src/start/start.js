import _                       from 'lodash';
import Backbone                from 'backbone';
import aptivator               from '../lib/aptivator';
import error                   from '../lib/error';
import fragment                from '../lib/fragment';
import missingParentsAssembler from './lib/missing-parents-assembler';

import {configs, queue} from '../lib/vars';

aptivator.start = () => 
  !async function() {
    let {defaultState} = configs;
    
    if(queue.length) {
      let missingParents = missingParentsAssembler(queue);
      error.throw(`undeclared parent states: [${missingParents}]`, 'starter');
    }
    
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
  }().catch(error.errorer);
