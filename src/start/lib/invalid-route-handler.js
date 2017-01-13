import $            from 'jquery';
import approximator from '../../lib/approximator';
import aptivator    from '../../lib/instance';
import fragment     from '../../lib/fragment';

let invalidRouteHandler = () => {
  if(fragment.toState()) {
    return;
  }
  
  let hash = fragment.get();
  let stateName = approximator.fromHash(hash);
  stateName = approximator.fromStateName('error', stateName);
  
  if(!stateName) {
    return alert(`Provided route [${hash}] is invalid`);
  } 
  
  aptivator.activate({name: stateName, direct: {fragment: hash}});
};

export default () => 
  new Promise(resolve => {
    $(() => setTimeout(() => {
      invalidRouteHandler();
      $(window).on('hashchange', invalidRouteHandler);
    }));
    
    resolve();
  });
