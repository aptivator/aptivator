import aptivator           from '../../lib/instance';
import displayer           from '../../lib/displayer';
import vars                from '../../lib/vars';
import animationEventNames from './animation-event-names/animation-event-names';

let {activationRecords} = vars.states;

let eventHandle = 'aptivator-goto-finalizer';

let triggerer = () => {
  aptivator.trigger(eventHandle);
  aptivator.off(eventHandle);
};

let animationHandle = animationEventNames.join(' ');

export default stateParams => 
  new Promise(resolve => {
    stateParams.flags.displayed = true;
    
    aptivator.on(eventHandle, () => resolve(stateParams));
    
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
    
    setTimeout(triggerer);
  });
