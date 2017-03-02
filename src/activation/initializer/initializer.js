import _                    from 'lodash';
import approximator         from '../../lib/approximator';
import aptivator            from '../../lib/aptivator';
import vars                 from '../../lib/vars';
import duplicatesRemover    from './lib/duplicates-remover';
import transientInitializer from './lib/transient-initializer';

let eventHandles = _.mapValues({transient: '', regular: ''}, (value, key) => {
  return `aptivator-goto-preprocessor-${key}`;
});

export default stateParams => 
  new Promise(async resolve => {
    let {transient} = stateParams.flags;
    
    _.extend(stateParams.flags, {initialized: true});    
    
    if(transient) {
      let eventHandle = eventHandles.transient;
      
      aptivator.once(eventHandle, () => resolve(stateParams));
      
      let query = {flags: {transient: true, initialized: false}};
      let startingTransients = aptivator.history.find(query);
      
      if(startingTransients.length) {
        return;
      }
      
      return aptivator.trigger(eventHandle);
    }
    
    let eventHandle = eventHandles.regular;
    
    aptivator.once(eventHandle, () => resolve(stateParams));
    
    let startingStates = aptivator.history.find({flags: {initialized: false, transient: false}});
    
    if(startingStates.length) {
      return;
    }

    let query = {flags: {pending: true, initialized: true, preprocessed: false, canceled: false}};
    let startedStates = aptivator.history.find(query);
    
    startedStates = await duplicatesRemover(startedStates);

    let transientStates = aptivator.history.find(stateParams => {
      let {active, pending, canceled, transient} = stateParams.flags;
      return transient && (active || pending) && !canceled;
    });
    
    transientStates = transientStates.reduce((o, stateParams) => {
      o[stateParams.stateName] = stateParams;
      return o;
    }, {});
      
    _.each(startedStates, stateParams => {
      let transientStateName = approximator.fromStateName('transient', stateParams.stateName);
      
      if(transientStateName) {
        let transientStateParams = transientStates[transientStateName];
        if(!transientStateParams) {
          transientStateParams = transientInitializer(transientStateName);
          transientStates[transientStateName] = transientStateParams;
        }
        
        if(!transientStateParams.owners) {
          transientStateParams.owners = new Set();
        }
        
        transientStateParams.owners.add(stateParams);
        _.extend(stateParams, {transientStateParams});
      }
    });

    if(vars.configs.showRuntime) {
      stateParams.time = _.now();
    }

    aptivator.trigger(eventHandle);
  });
