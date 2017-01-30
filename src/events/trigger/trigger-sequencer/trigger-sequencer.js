import _                from 'lodash';
import depthFinder      from './lib/depth-finder';
import triggerSequencer from './lib/trigger-sequencer';

export default (events, mainArgs) => {
  let triggerSequence = triggerSequencer(events, mainArgs);
  triggerSequence = _.uniqWith(triggerSequence, _.isEqual);
  return triggerSequence.sort((...records) => 
    depthFinder(records[0]) - depthFinder(records[1]));
};
