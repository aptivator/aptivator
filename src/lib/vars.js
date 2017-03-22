import Backbone from 'backbone';

const activatingRegulars = [];
const activatingTransients = [];
const configs = {};
const dataParams = {};
const deactivating = [];
const errorRegistry = [];
const eventRegistry = {};
const history = [];
const paramsMap = {};
const queue = [];
const registry = {};
const resolveDefinitions = {};
const resolveParams = {};
const rootStateName = 'root';
const router = new Backbone.Router();
const spaceSplitter = /\s+/;
const transientDelay = 300;
const transientRegistry = [];

export {
  activatingRegulars,
  activatingTransients,
  configs,
  dataParams,
  deactivating,
  errorRegistry,
  eventRegistry,
  history,
  paramsMap,
  queue,
  registry,
  resolveDefinitions,
  resolveParams,
  rootStateName,
  router,
  spaceSplitter,
  transientDelay,
  transientRegistry
};
