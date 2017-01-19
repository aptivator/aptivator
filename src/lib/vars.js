import Backbone from 'backbone';

export default {
  configs: {},
  
  rootStateName: 'root',
  
  router: new Backbone.Router(),
  
  states: {
    activationRecords: {},
    activationSequences: {},
    error: [],
    queue: [],
    registry: {},
    transient: []
  },
  
  viewsRegistry: {}
};
