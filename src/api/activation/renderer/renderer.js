import _               from 'lodash';
import addresser       from '../../../lib/addresser';
import vars            from '../../../lib/vars';
import addressOrderer  from './lib/address-orderer';
import cacheable       from './lib/cacheable';
import multiplesTester from './lib/multiples-tester';
import paramsAssembler from './lib/params-assembler';
import remover         from './lib/remover';
import viewApi         from './lib/view-api';
import viewsDisplayer  from './lib/views-displayer';

let {activationRecords} = vars.states;

export default (callback, stateParams) => {
  let {activationSequence} = stateParams.activationSequences[stateParams.stateName];
  
  addressOrderer(_.keys(activationSequence)).forEach(viewAddressFull => {
    let parentStateName = addresser.stateName(viewAddressFull);
    let parentConfigs = vars.states.registry[parentStateName];
    let parentRecord = activationRecords[parentStateName];
    let regionName = addresser.region(viewAddressFull);
    let parentRegions = parentRecord.regions || (parentRecord.regions = {});
    let targetRegion = parentRegions[regionName] || (parentRegions[regionName] = {});
    let viewConfigs = activationSequence[viewAddressFull];
    let {stateName, main, detachHidden} = viewConfigs;
    let cacheAddress = main ? stateName : viewAddressFull;
    let activationRecord = activationRecords[cacheAddress];
    let cache = cacheable.total(viewConfigs, stateParams, cacheAddress);
    let destroy = !cache && activationRecord;
    let multiple = multiplesTester(parentConfigs, regionName);
    let hide = !multiple && (targetRegion.current && (!destroy || (destroy && !targetRegion.current.has(cacheAddress))));
    let unhide = !destroy && activationRecord;
    let parentInstance = parentRecord.instance;
    let regionInstance = parentInstance[regionName];

    if(!targetRegion.current) {
      targetRegion.current = new Set();
    }
    
    if(!regionInstance) {
      callback(`region [${regionName}] does not exist for [${parentStateName}] state`);
    }
    
    regionInstance._ensureElement();
    
    if(destroy) {
      remover.destroy(activationRecord, multiple);
    }
    
    if(hide) {
      remover.hide({targetRegion, cacheAddress, detach: detachHidden});
    }
    
    targetRegion.current.add(cacheAddress);
    
    if(unhide) {
      if(!cacheable.implicit.cache) {
        if(!_.isObject(cache) || !cache.receiver) {
          callback(`receiver function for variable parameters has not been provided`);
        }
        
        let parameters = paramsAssembler(viewConfigs, stateParams);
        activationRecord.instance[cache.receiver](parameters); 
      }

      viewsDisplayer({cacheAddresses: targetRegion.current, regionInstance, activationSequence});
      
      return;
    }
    
    let parameters = paramsAssembler(viewConfigs, stateParams);
    let instance = new viewConfigs.view(parameters);
    let serializeData = instance.serializeData;
    
    if(!main) {
      if(!parentRecord.immediates) {
        parentRecord.immediates = new Set();
      }
      
      parentRecord.immediates.add(cacheAddress);
    }
    
    _.extend((activationRecords[cacheAddress] || (activationRecords[cacheAddress] = {})), {
      instance
    });
    
    instance.serializeData = function(...args) {
      var data = serializeData && serializeData.apply(this, args);
      return _.extend(this.options, data, {aptivator: viewApi});
    };
    
    viewsDisplayer({cacheAddresses: targetRegion.current, regionInstance, excludes: [cacheAddress]});
    
    instance.render();
    regionInstance.$el.append(instance.$el);
  });

  callback();
};
