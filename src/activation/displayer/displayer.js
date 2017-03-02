import _         from 'lodash';
import animator  from '../../animation/animator';
import aptivator from '../../lib/aptivator';
import displayer from '../../lib/displayer';

let eventHandle = 'aptivator-goto-finalizer';

export default stateParams => 
  new Promise(async resolve => {
    stateParams.flags.displayed = true;
    aptivator.once(eventHandle, () => resolve(stateParams));
    
    let query = {flags: {pending: true, rendered: true, displayed: false, canceled: false}};
    let renderingStates = aptivator.history.find(query);
    
    if(renderingStates.length) {
      return;
    }
    
    query = {flags: {pending: true, displayed: true, canceled: false}};
    let renderedStates = aptivator.history.find(query);
    
    let stateNames = _.map(renderedStates, stateParams => {
      let {stateName, rootViews, beginningStateName} = stateParams;
      _.each(rootViews, rootView => displayer(rootView));
      delete stateParams.rootViews;
      return [beginningStateName, stateName];
    });
    
    await animator(stateNames, 'enter');
    
    aptivator.trigger(eventHandle);
  });
