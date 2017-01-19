var Marionette = require('backbone.marionette');
var formTpl = require('./form.tpl');

module.exports = Marionette.ItemView.extend({
  initialize: function() {
    setTimeout(function() {
      this.$el.find('input:first').val('test test ....');
    }.bind(this), 5000);
  },
  
  className: 'app-2-form',
  
  template: formTpl,
  
  events: {
    'click button': 'processButtonClick'
  },
  
  processButtonClick: function(evt) {
    evt.preventDefault();
    alert('Clicked...');
  }  
});
