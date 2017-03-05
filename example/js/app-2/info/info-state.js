var aptivator = require('aptivator');
var infoTpl = require('./info.tpl');

aptivator.state('app-2.info', {
  route: 'info',
  template: infoTpl,
  parentSelector: '.main'
});
