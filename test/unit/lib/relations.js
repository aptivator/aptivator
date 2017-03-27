var basePath = '../../../built/';
var expect = require('chai').expect;
var relations = require(basePath + 'lib/relations').default;
var rootStateName = require(basePath + 'lib/vars').rootStateName;

module.exports = {
  'lib :: relations': {
    'produces an array of all relations from a state name': function() {
      var family = relations.family('app-2.form');
      expect(family).to.eql([rootStateName, 'app-2', 'app-2.form']);
    },
    
    'produces an array of all relations from a unique address': function() {
      var family = relations.family('aptivator-id-1@app-2.form');
      expect(family).to.eql([rootStateName, 'app-2', 'app-2.form', 'aptivator-id-1@app-2.form']);
    },
    
    'detects if a state name is root': function() {
      expect(relations.isRoot(rootStateName)).to.be.true;
    },
    
    'detects if a state name is not root': function() {
      expect(relations.isRoot('app-2')).to.be.not.true;
    },
    
    'determines a regular parent state': function() {
      expect(relations.parent('app-2.form')).to.equal('app-2');
    },
    
    'determines a root parent state': function() {
      expect(relations.parent('app-2')).to.equal(rootStateName);
    },
    
    'splits a state name into a correct number of parts': function() {
      var stateName = 'auth.forgot.password';
      var stateNameParts = ['auth', 'forgot', 'password'];
      expect(relations.parts(stateName)).to.eql(stateNameParts);
    },
    
    'sorts an array of state names hierarchically and ascendingly': function() {
      let stateNames = ['app.inner.outer', 'app-2', 'app1.another'];
      let sorted = ['app-2', 'app1.another', 'app.inner.outer'];
      stateNames.sort(relations.hierarchySorter());
      expect(stateNames).to.eql(sorted);
    },
    
    'sorts an array of state names hierarchically and descendingly': function() {
      let stateNames = ['app.inner.outer', 'app-2', 'app1.another'];
      let sorted = ['app.inner.outer', 'app1.another', 'app-2'];
      stateNames.sort(relations.hierarchySorter(true));
      expect(stateNames).to.eql(sorted);
    },
    
    'sorts an array of objects by stateName hierarchically and ascendingly': function() {
      let stateObjs = [{stateName: 'app-2.form'}, {stateName: 'app-1'}];
      let sorted = [{stateName: 'app-1'}, {stateName: 'app-2.form'}];
      stateObjs.sort(relations.hierarchySorter());
      expect(stateObjs).to.eql(sorted);
    },
    
    'sorts an array of objects by stateName hierarchically and descendingly': function() {
      let stateObjs = [{stateName: 'app-1'}, {stateName: 'app-2.form'}];
      let sorted = [{stateName: 'app-2.form'}, {stateName: 'app-1'}];
      stateObjs.sort(relations.hierarchySorter(true));
      expect(stateObjs).to.eql(sorted);
    }
  }  
};
