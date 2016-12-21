import Marionette from 'backbone.marionette';
import vars       from '../../../libs/vars';

export default callback => {
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
};
