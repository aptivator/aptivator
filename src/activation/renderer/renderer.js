import _                 from 'lodash';
import addresser         from '../../lib/addresser';
import aptivator         from '../../lib/instance';
import error             from '../../lib/error';
import params            from '../../lib/params';
import relations         from '../../lib/relations';
import vars              from '../../lib/vars';
import addressOrderer    from './lib/address-orderer';
import cacheable         from './lib/cacheable';
import siblingsDisplayer from './lib/siblings-displayer';
import viewApi           from './lib/view-api';

let {activationRecords, activationSequences, registry} = vars.states;

export default stateParams => 
  new Promise(resolve => {
    let {activationSequence} = activationSequences[stateParams.stateName];

    addressOrderer(_.keys(activationSequence)).forEach(viewAddressFull => {
      let [regionName, parentStateName] = addresser.parts(viewAddressFull);
      let parentRecord = activationRecords[parentStateName];
      let multiple = (registry[parentStateName].multiples || []).includes(regionName);
      let parentInstance = parentRecord.instance;
      let regionInstance = parentInstance[regionName];
      let parentRegions = parentRecord.regions || (parentRecord.regions = {});
      let targetRegion = parentRegions[regionName] || (parentRegions[regionName] = {});
      let viewConfigs = activationSequence[viewAddressFull];
      let {stateName, main, viewAddressUnique} = viewConfigs;
      let cacheAddress = main ? stateName : viewAddressFull;
      let activationRecord = activationRecords[cacheAddress] || (activationRecords[cacheAddress] = {});
      let cache = cacheable.total(viewConfigs, stateParams, cacheAddress);
      let destroy = !cache && activationRecord.instance;
      let unhide = !destroy && !_.isEmpty(activationRecord);
      let family = relations.family(stateName).concat(viewAddressUnique);
      let viewParameters = params.assemble(family, stateParams);

      if(!regionInstance) {
        error.throw(`region [${regionName}] does not exist for [${parentStateName}] state`);
      }
      
      if(!viewConfigs.cacheAddress) {
        _.extend(viewConfigs, {cacheAddress});
      }
      
      if(!targetRegion.current) {
        targetRegion.current = new Set();
      }
      
      regionInstance._ensureElement();
      
      if(destroy) {
        aptivator.destroy({name: cacheAddress});
      }
      
      targetRegion.current.add(cacheAddress);
      
      if(unhide) {
        siblingsDisplayer({targetRegion, regionInstance, multiple, includes: [cacheAddress]});

        if(!cacheable.implicit.cache) {
          if(!_.isObject(cache) || !cache.receiver) {
            error.throw(`receiver function for variable parameters has not been provided`);
          }
          
          activationRecord.instance[cache.receiver](viewParameters); 
        }

        return;
      }

      let instance = new viewConfigs.view(viewParameters);
      let serializeData = instance.serializeData;
      
      instance.serializeData = function(...args) {
        var data = serializeData && serializeData.apply(this, args);
        return _.extend(this.options, data, {aptivator: viewApi});
      };
      
      siblingsDisplayer({targetRegion, regionInstance, multiple, excludes: [cacheAddress]});
      
      _.extend(activationRecord, {active: true, instance});
      
      instance.on('destroy', () => {
        activationRecord.instance = null;
        targetRegion.current.delete(cacheAddress);
        _.each(activationRecord.regions, regionObj => {
          regionObj.current.forEach(name => aptivator.deactivate({name, detach: true, focal: true}));
        });
      });
      
      instance.render();
      regionInstance.$el.append(instance.$el);    
    });
  
    resolve(stateParams);
  });
