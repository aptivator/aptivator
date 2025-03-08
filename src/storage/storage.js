import _                      from 'lodash';
import aptivator              from '../lib/aptivator';
import storageActionGenerator from './lib/storage-action-generator';

aptivator.m = new Map();

_.each({l: localStorage, s: sessionStorage}, (store, storeAbbr) => {
  aptivator[storeAbbr] = {
    get: storageActionGenerator(store),
    set: storageActionGenerator(store, true)
  };
});
