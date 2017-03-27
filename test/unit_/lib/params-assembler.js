let basePath = '../../../built/';
let expect = require('chai').expect;
let vars = require('../../common/vars');
let {app6TesterStateParams} = vars;
let paramsAssembler = require(basePath + 'lib/params-assembler').default;

module.exports = {
  'lib :: params assembler': {
    'assembles params for activated state': function() {
      let params = paramsAssembler('app-6.tester', app6TesterStateParams);
      let {data, resolves, route, direct, hooks} = params;
      
      expect(data).to.eql({
        names: ['Fiora', 'Fiona'],
        apiKey: '777777',
        imagePath: 'image.png'
      });
      
      expect(resolves).to.eql({
        one: 1,
        two: 222
      });

      expect(route).to.eql({
        params: {one: 1, two: 2},
        fragment: 'app-6/tester/1/2',
        stateName: 'app-6.tester'
      });
      
      expect(direct).to.eql({
        dmitriy: 'dmitriy'
      });

      expect(hooks).to.eql({
        start: {
          tester: 'tester'
        }
      });
    },
    
    'assembles params for ancestor of activated state': function() {
      let params = paramsAssembler('app-6', app6TesterStateParams);
      let {data, resolves, route, direct, hooks} = params;
      
      expect(data).to.eql({
        names: ['Fiora', 'Fiona'],
        apiKey: '12345'
      });
      
      expect(resolves).to.eql({
        one: 1,
        two: 2
      });
      
      expect(route).to.eql({});
      
      expect(direct).to.eql({});
      
      expect(hooks).to.eql({});
    }
  }  
};
