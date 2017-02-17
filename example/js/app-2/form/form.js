var aptivator = require('aptivator');
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
    'click button': 'weave'
  },
  
  weaveToggle: true,
  
  weave: function(evt) {
    if(this.weaveToggle) {
      aptivator.activate({name: 'app-2.form.message', flags: {parallel: true, augment: true, noResolves: true}});
      this.weaveToggle = false;
    } else {
      aptivator.deactivate({name: 'app-2.form.message', partial: true});
      this.weaveToggle = true;
    }
    
    return false;
  }  
});
