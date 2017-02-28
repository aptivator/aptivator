import Backbone from 'backbone';

export default {
  activating: {
    transient: [],
    regular: []
  },
  
  configs: {},
  
  dataParams: {},
  
  deactivating: [],
  
  eventRegistry: {},
  
  paramsMap: {},
  
  rootStateName: 'root',
  
  router: new Backbone.Router(),
  
  resolveDefinitions: {},
  
  resolveParams: {},
  
  spaceSplitter: /\s+/,
  
  states: {
    activationRecords: {},
    activationSequences: {},
    error: [],
    history: [],
    queue: [],
    registry: {},
    transient: []
  },
  
  transientDelay: 300
};
