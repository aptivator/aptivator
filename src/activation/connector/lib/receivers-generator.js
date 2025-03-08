import _                   from 'lodash';
import Receiver            from './receiver-class';
import receiversNormalizer from './receivers-normalizer';

export default (instance, receivers, params) => 
  _.map(receiversNormalizer(receivers), (receiverConfigs, receiver) => 
    new Receiver(instance, receiver, receiverConfigs, params));
