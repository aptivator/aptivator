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
    
    let animationStates = _.reduce(renderedStates, (animationStates, renderedStateParams) => {
      let {stateName, rootViews, beginningStateName} = renderedStateParams;
      let primary = stateParams === renderedStateParams;
      setTimeout(() => _.each(rootViews, rootView => displayer(rootView)));
      delete renderedStateParams.rootViews;
      
      if(beginningStateName) {
        animationStates.push({
          stateParams: renderedStateParams, 
          beginningStateName, 
          stateName, 
          primary
        });
      }
      
      return animationStates;
    }, []);
    
    await animator(animationStates, 'enter');
    
    aptivator.trigger(eventHandle);
  });
