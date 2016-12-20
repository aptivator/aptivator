import Backbone from 'backbone';

export default {
  rootStateName: 'aptivator-root-state',
  
  router: new Backbone.Router(),
  
  states: {
    activationRecords: {},
    queue: [],
    registry: {}
  }
};
