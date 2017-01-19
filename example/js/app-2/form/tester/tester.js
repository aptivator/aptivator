var Marionette = require('backbone.marionette');
var testerTpl = require('./tester.tpl');

module.exports = Marionette.ItemView.extend({
  template: testerTpl
});
