import Backbone   from 'backbone';
import Marionette from 'backbone.marionette';
import aptivator  from '../libs/instance';
import error      from '../libs/error';
import fragment   from '../libs/fragment';
import utils      from '../libs/utils';
import vars       from '../libs/vars';

aptivator.start = () => utils.waterfall([
  function checkStatesQueue(callback) {
    if(!vars.states.queue.length) { return callback(); }
    let undefinedStateNames = vars.states.queue.map(stateDefinition => stateDefinition[0]).join(', ');
    callback(`unable to initialize [${undefinedStateNames}] states`);
  },
  
  function createRootView(callback) {
    let rootStateConfigs = vars.states.registry[vars.rootStateName];
    let RootView = Marionette.LayoutView.extend({
      el: 'html',
      regions: {
        main: rootStateConfigs.el || 'body'
      }
    });
    
    let rootView = new RootView();
    let mainView = rootView;
    
    if(rootStateConfigs.view) {
      mainView = new rootStateConfigs.view();
      rootView.main.show(mainView);
    }
    
    vars.states.activationRecords[vars.rootStateName] = {instance: mainView};
    
    callback();
  }
], err => {
  if(err) { 
    return error.throw(err);
  }
  
  let rootStateConfigs = vars.states.registry[vars.rootStateName];
  let {defaultStates} = rootStateConfigs;
  
  Backbone.history.start();
  
  if(!fragment.toState() && defaultStates) {
    defaultStates.forEach(stateName => 
      aptivator.activate({stateName, directParams: {running: true}}));
  }
});
