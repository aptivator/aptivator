import _           from 'lodash';
import aptivator   from '../lib/aptivator';

import {history} from '../lib/vars';

aptivator.history = {
  find(predicate) {
    return _.filter(history, predicate).reverse();
  },
  
  findOne(predicate) {
    return this.find(predicate)[0];
  }
};
