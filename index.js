/* jshint node: true */
'use strict';

var funnel = require('broccoli-funnel');

module.exports = {
  name: 'ember-highlight-code',
  
  included: function(app) {
    this._super.included(app);
    
    var settings = app.project.config()['ember-highlight-code'];
    
    if(!settings.style) {
      settings.style = 'tomorrow';
    }
    
    // Import the correct JS for chosen
    app.import(app.bowerDirectory + '/highlightjs/highlight.pack.js');
    app.import(app.bowerDirectory + '/highlightjs/styles/' + settings.style + '.css');
  }
};
