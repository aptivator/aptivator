var aptivator = require('aptivator');
//var App2InfoView = require('./info');
var infoTpl = require('./info.tpl');

aptivator.state('app-2.info', {
  route: 'info',
  //view: App2InfoView,
  template: infoTpl,
  parentSelector: '.main'
});
