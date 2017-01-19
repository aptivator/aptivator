var aptivator = require('aptivator');
var TesterView = require('./tester');

aptivator.state('app-2.form.tester', {
  route: 'tester',
  view: TesterView,
  parentSelector: '.main'
});
