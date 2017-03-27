var basePath = '../../../../built/';
var _ = require('lodash');
var expect = require('chai').expect;
var canceler = require(basePath + 'activation/canceler/canceler').default;

module.exports = {
  'activation :: canceler': {
    'throws duplicate serial state error': function() {
      var stateParams = {stateName: 'test', flags: {duplicateSerial: true}};
      var canceler_ = _.partial(canceler, stateParams);
      expect(canceler_).to.throw({
        type: 'duplicate',
        message: `state [test] is serial and cannot be activated with another serial state`,
        stateParams: stateParams
      });
    },
    
    'throws canceled error': function() {
      var stateParams = {stateName: 'test', flgas: {canceled: true}};
      var canceler_ = _.partial(canceler, stateParams);
      expect(canceler_).to.throw({
        type: 'canceled',
        message: `state [test] was canceled`,
        stateParams: stateParams
      });
    },
    
    'returns undefined when no error flags are set': function() {
      var stateParams = {stateName: 'test', flags: {preprocessed: true}};
      expect(canceler(stateParams)).to.be.undefined;
    }
  }  
};
