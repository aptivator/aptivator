import Backbone from 'backbone';

export default {
  historySize: 25,
  
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
