var basePath = '../../../../built/';
var _ = require('lodash');
var expect = require('chai').expect;
var routeAssembler = require(basePath + 'lib/route/route-assembler').default;

module.exports = {
  'lib :: route :: route assembler': {
    'throws an error if called for a non-existent state': function() {
      var routeAssembler_ = _.partial(routeAssembler, 'not-declared-state');
      expect(routeAssembler_).to.throw(/state \[not-declared-state\] does not exist/);
    },
    
    'throws an error if called for a state with no route': function() {
      var routeAssembler_ = _.partial(routeAssembler, 'app-2');
      expect(routeAssembler_).to.throw(/state \[app-2\] does not have a route/);
    },
    
    'throws an error if values do not pass asserters': function() {
      var routeAssembler_ = _.partial(routeAssembler, 'app-1', ['22', 3]);
      expect(routeAssembler_).to.throw(/a route value did not pass validation/);
    },
    
    'throws an error if a value for a required parameter is not provided': function() {
      var routeAssembler_ = _.partial(routeAssembler, 'app-3');
      expect(routeAssembler_).to.throw(/expecting a value for/);
    },
    
    'returns a route object with all required params': function() {
      var routeObj = routeAssembler('app-1', [22, 2]);
      expect(routeObj.params).to.eql({one: 22, two: 2});
      expect(routeObj.fragment).to.equal('app-1/p22/2');
      expect(routeObj.stateName).to.equal('app-1');
    },
    
    'returns a route object with some optionals with no value': function() {
      var routeObj = routeAssembler('app-4');
      expect(routeObj.params).to.eql({one: 1});
      expect(routeObj.fragment).to.equal('app-4/p1');
      expect(routeObj.stateName).to.equal('app-4');
    },
    
    'returns a route object with all optionals with value': function() {
      var routeObj = routeAssembler('app-4', ['44', '555']);
      expect(routeObj.params).to.eql({one: '44', two: '555'});
      expect(routeObj.fragment).to.equal('app-4/p44/555');
      expect(routeObj.stateName).to.equal('app-4');
    },
    
    'throws an error when values and asserters are specified as arrays': function() {
      var routeAssembler_ = _.partial(routeAssembler, 'app-5', [33432, 2343]);
      expect(routeAssembler_).to.throw(/a route value did not pass validation/);
    },
    
    'returns a route object with values and asserters specified in arrays': function() {
      var routeObj = routeAssembler('app-5');
      expect(routeObj.params).to.eql({one: 12343, two: 'dmitriy'});
      expect(routeObj.fragment).to.equal('app-5/p12343/zzzdmitriy');
      expect(routeObj.stateName).to.equal('app-5');
    }
  }
};
