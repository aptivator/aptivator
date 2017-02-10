import aptivator           from '../../lib/instance';
import displayer           from '../../lib/displayer';
import vars                from '../../lib/vars';

let {activationRecords} = vars.states;
let eventHandle = 'aptivator-goto-finalizer';
let animationHandle = 'animationend transitionend';

export default stateParams => 
  new Promise(resolve => {
    stateParams.flags.displayed = true;
    
    aptivator.once(eventHandle, () => resolve(stateParams));
    
    let query = {flags: {rendered: true, displayed: false, canceled: false}};
    let renderingStates = aptivator.history.find(query);
    
    if(renderingStates.length) {
      return;
    }
    
    query = {flags: {pending: true, displayed: true, canceled: false}};
    let renderedStates = aptivator.history.find(query);
    
    let $rootEl = activationRecords[vars.rootStateName].instance.$el;
    
    $rootEl.addClass('aptivator-fade-in');
    
    $rootEl.one(animationHandle, () => $rootEl.removeClass('aptivator-fade-in'));
    
    renderedStates.forEach(stateParams => {
      let {rootViews} = stateParams;
      rootViews.forEach(rootView => displayer(...rootView));
      delete stateParams.rootViews;
    });
    
    aptivator.trigger(eventHandle);
  });
