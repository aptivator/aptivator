import _         from 'lodash';
import animator  from '../../animation/animator';
import aptivator from '../../lib/instance';
import displayer from '../../lib/displayer';
import canceler  from '../canceler/canceler';

let eventHandle = 'aptivator-goto-finalizer';

export default stateParams => {
  canceler(stateParams);
  
  return new Promise(async resolve => {
    stateParams.flags.displayed = true;
    
    aptivator.once(eventHandle, () => resolve(stateParams));
    
    let query = {flags: {rendered: true, displayed: false, canceled: false}};
    let renderingStates = aptivator.history.find(query);
    
    if(renderingStates.length) {
      return;
    }
    
    query = {flags: {pending: true, displayed: true, canceled: false}};
    let renderedStates = aptivator.history.find(query);
    let stateNames = _.map(renderedStates, stateParams => {
      let {stateName, rootViews} = stateParams;
      _.each(rootViews, rootView => displayer(rootView));
      delete stateParams.rootViews;
      return stateName;
    });
    
    await animator(stateNames, 'enter');
    
    aptivator.trigger(eventHandle);
  });
};
