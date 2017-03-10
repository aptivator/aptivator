var $ = require('jquery');
var Marionette = require('backbone.marionette');
var selectorTpl = require('./selector.tpl');

module.exports = Marionette.ItemView.extend({
  initialize: function(params) {
    this.params = params;
  },
  
  ui: {
    selector: '#selector',
    form: '#some-form'
  },
  
  events: {
    'change #selector': 'select',
    'keyup #keyup': 'keyup'
  },
  
  template: selectorTpl,
  
  serializeData: function() {
    return this.params;
  },
  
  disableForm: function() {
    this.ui.form.find('input, select').attr('disabled', 'disabled');
  },
  
  enableForm: function() {
    this.ui.form.find('input, select').removeAttr('disabled');
  },
  
  resetData: function(data) {
    this.ui.form[0].reset();
  },
  
  stringified: function(data) {
    return data['stringified'].toUpperCase();
  },
  
  keyupReceiver: function(data) {
    return data['keyup'].toLowerCase();
  },
  
  keyup: function(evt) {
    var value = $(evt.target).val();
    return value;
  },
  
  select: function(evt) {
    return $(evt.target).val();
  }
});
