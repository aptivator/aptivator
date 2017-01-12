import Marionette from 'backbone.marionette';
import vars       from '../../lib/vars';

export default () => 
  new Promise(resolve => {
    let rootStateConfigs = vars.states.registry[vars.rootStateName];
    let rootView = new (Marionette.LayoutView.extend({
      el: 'html',
      regions: {
        main: rootStateConfigs.el || 'body'
      }
    }))();
    let instance = rootView;
    
    if(rootStateConfigs.view) {
      instance = new rootStateConfigs.view();
      rootView.main.show(instance);
    }
    
    vars.states.activationRecords[vars.rootStateName] = {instance};
    resolve();
  });
