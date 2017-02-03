import Backbone from 'backbone';

export default {
  configs: {},
  
  dataParams: {},
  
  eventRegistry: {},
  
  eventSplitter: /\s+/,
  
  rootStateName: 'root',
  
  router: new Backbone.Router(),
  
  states: {
    activationRecords: {},
    activationSequences: {},
    error: [],
    history: [],
    queue: [],
    registry: {},
    transient: []
  },
  
  resolveDefinitions: {},
  
  resolveParams: {},
  
  transientDelay: 300,
  
  viewsRegistry: {}
};
