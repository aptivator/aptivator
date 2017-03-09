var Marionette = require('backbone.marionette');
var plusTpl    = require('./plus.tpl');

module.exports = Marionette.ItemView.extend({
  initialize: function() {
    this.$el.on('click', function() {
      this.destroy();
    }.bind(this));
  },
  
  template: plusTpl,
  
  ui: {
    texter: '.texter'
  },
  
  handler: function(data) {
    console.log(this.ui);
    console.log(data.result);
  },
  
  another: function(data) {
    console.log(data.result);
  },
  
  texter(data) {
    this.ui.texter.text(data['input-text']);
  }
});
