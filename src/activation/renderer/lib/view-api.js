import routeAssembler from '../../../lib/route/route-assembler';

export default {
  href(stateName, ...routeValues) {
    return `#${routeAssembler(stateName, routeValues).fragment}`;
  }
};
