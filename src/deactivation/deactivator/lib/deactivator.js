import _             from 'lodash';
import addresser     from '../../../lib/addresser';
import vars          from '../../../lib/vars';
import hider         from './hider';

let {activationRecords, activationSequences, registry} = vars.states;

export default {
  full(params) {
    let stateName = addresser.stateName(params.name);
    let activationSequence = activationSequences[stateName];
    
    _.each(activationSequence, viewConfigs => {
      this.partial({name: viewConfigs.uniqueAddress});
    });
  },
  
  partial(params) {
    let {name, detach = {}} = params;
    let uniqueAddress = name.includes('@') ? name : registry[name].uniqueAddress;
    let stateName = addresser.stateName(uniqueAddress);
    let stateConfigs = registry[stateName];
    let activationRecord = activationRecords[uniqueAddress] || {};
    
    if(!activationRecord.active && !detach.focal) {
      return;
    }
  
    let {focal: detachFocal, children: detachChildren, full: detachFull} = detach;
    detach = _.isUndefined(detachFocal) && detachFull || detachFocal;
  
    if(stateConfigs.uniqueAddress === uniqueAddress) {
      _.each(stateConfigs.views, viewConfigs => {
        let {uniqueAddress, stateName: viewStateName} = viewConfigs;
        if(viewStateName === stateName) {
          hider(uniqueAddress, detach);
        }
      });  
    }

    detach = {focal: detachChildren, full: detachFull};
    
    _.each(activationRecord.regions, regionObj => {
      regionObj.current.forEach(uniqueAddress => {
        this.partial({name: uniqueAddress, detach: _.clone(detach)});
      });
    });    
  }
};
