import _         from 'lodash';
import aptivator from '../../lib/instance';
import error     from '../../lib/error';
import params    from '../../lib/params';
import relations from '../../lib/relations';
import vars      from '../../lib/vars';
import cacheable from './lib/cacheable';
import displayer from './lib/displayer';
import viewApi   from './lib/view-api';

let {activationRecords, activationSequences, registry} = vars.states;

export default stateParams => {
  activationSequences[stateParams.stateName].forEach(viewConfigs => {
    let {stateName, viewAddressUnique, viewRegionName, viewStateName, multiple, transient} = viewConfigs;
    let parentRecord = activationRecords[registry[viewStateName].viewAddressUnique];
    let parentInstance = parentRecord.instance;
    let regionInstance = parentInstance[viewRegionName];
    let parentRegions = parentRecord.regions || (parentRecord.regions = {});
    let targetRegion = parentRegions[viewRegionName] || (parentRegions[viewRegionName] = {current: new Set()});
    let activationRecord = activationRecords[viewAddressUnique] || (activationRecords[viewAddressUnique] = {});
    let cache = cacheable.total(viewConfigs, stateParams);
    let destroy = !cache && activationRecord.instance;
    let unhide = !destroy && !_.isEmpty(activationRecord);
    let family = relations.family(stateName).concat(viewAddressUnique);
    let viewParameters = params.assemble(family, stateParams);

    if(!regionInstance) {
      error.throw(`region [${viewRegionName}] does not exist for [${viewStateName}] state`);
    }
    
    if(!regionInstance._aptivatorEnsuredElement) {
      regionInstance._aptivatorEnsuredElement = true;
      regionInstance._ensureElement();
    }
    
    if(destroy) {
      aptivator.destroy({name: viewAddressUnique});
    }
    
    targetRegion.current.add(viewAddressUnique);
    
    if(unhide) {
      if(!cacheable.implicit.cache) {
        if(!_.isObject(cache) || !cache.receiver) {
          error.throw(`receiver function for variable parameters has not been provided`);
        }
        
        activationRecord.instance[cache.receiver](viewParameters); 
      }
      
      displayer.single(activationRecord, regionInstance);
      
      if(multiple) {
        displayer.multiple({targetRegion, regionInstance, transient, exclude: [viewAddressUnique]});
      }

      return;
    }

    let instance = new viewConfigs.view(viewParameters);
    let serializeData = instance.serializeData;
    
    instance.serializeData = function(...args) {
      var data = serializeData && serializeData.apply(this, args);
      return _.extend(this.options, data, {aptivator: viewApi});
    };
    
    if(multiple) {
      displayer.multiple({targetRegion, regionInstance, transient, exclude: [viewAddressUnique]});
    }
    
    _.extend(activationRecord, {active: true, instance, transient});
    
    instance.on('destroy', () => {
      delete activationRecord.instance;
      targetRegion.current.delete(viewAddressUnique);
      _.each(activationRecord.regions, regionObj => {
        regionObj.current.forEach(name => {
          aptivator.deactivate({name, detach: true, ignoreMultiple: true, focal: true});
        });
      });
    });
    
    instance.render();
    regionInstance.$el.append(instance.$el);    
  });

  return stateParams;
};
