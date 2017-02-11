import animator  from '../../animation/animator';
import aptivator from '../../lib/instance';
import displayer from '../../lib/displayer';

let eventHandle = 'aptivator-goto-finalizer';

export default stateParams => 
  new Promise(async resolve => {
    stateParams.flags.displayed = true;
    
    aptivator.once(eventHandle, () => resolve(stateParams));
    
    let query = {flags: {rendered: true, displayed: false, canceled: false}};
    let renderingStates = aptivator.history.find(query);
    
    if(renderingStates.length) {
      return;
    }
    
    query = {flags: {pending: true, displayed: true, canceled: false}};
    let renderedStates = aptivator.history.find(query);
    
    renderedStates.forEach(stateParams => {
      stateParams.rootViews.forEach(rootView => displayer(...rootView));
      delete stateParams.rootViews;
    });
    
    await animator(renderedStates, 'enter');
    
    aptivator.trigger(eventHandle);
  });
