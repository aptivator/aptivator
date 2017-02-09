var Marionette = require('backbone.marionette');
var app1Tpl = require('./app-1.tpl');

module.exports = Marionette.ItemView.extend({
  template: app1Tpl,
  
  receiver: function(params) {
    this.options = params;
    this.render();
  }
});
