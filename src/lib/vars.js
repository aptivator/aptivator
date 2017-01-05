import Backbone from 'backbone';

export default {
  historySize: 25,
  
  rootStateName: 'aptivator-root-state',
  
  router: new Backbone.Router(),
  
  states: {
    activationRecords: {},
    queue: [],
    registry: {},
    error: {
      root: [],
      nested: []
    },
    transient: []
  }
};
