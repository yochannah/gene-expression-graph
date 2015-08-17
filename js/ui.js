var util = require('./util'),
template = require('../template/basechart.html');
var ui = function(settings){
  this.settings = settings;
  var init = function(){
    settings.parentElem.innerHTML = getTemplate();
    util.addClass(settings.parentElem, "gene-expression-atlas-diseases");
    settings.statusBar = settings.parentElem.querySelector('.status');
  },
  getTemplate = function(){
    return template;
  }
  return {init:init}
};

module.exports = ui;
