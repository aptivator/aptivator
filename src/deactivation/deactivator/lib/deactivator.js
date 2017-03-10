import _             from 'lodash';
import addresser     from '../../../lib/addresser';
import relations     from '../../../lib/relations';
import vars          from '../../../lib/vars';
import hider         from './hider';

let {registry} = vars.states;

export default {
  full(params) {
    let stateName = addresser.stateName(params.name);
    let family = relations.family(stateName).slice(1);
    _.each(family, stateName => {
      this.partial({name: stateName});
    });
  },
  
  partial(params) {
    let stateName = addresser.stateName(params.name);
    _.each(registry[stateName].views, viewConfigs => {
      this.focal({name: viewConfigs.uniqueAddress});
    });
  },
  
  focal(params) {
    let {name, detach = {}} = params;
    let record = addresser.record(name);
    let {focal: detachFocal, children: detachChildren, full: detachFull} = detach;
    detach = _.isUndefined(detachFocal) && detachFull || detachFocal;
  
    hider(record, detach);
    
    detach = {focal: detachChildren, full: detachFull};
    
    _.each(record.regions, regionObj => {
      regionObj.current.forEach(uniqueAddress => {
        this.focal({name: uniqueAddress, detach: _.clone(detach)});
      });
    });    
  }
};
