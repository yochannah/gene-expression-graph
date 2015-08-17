var util = require('./util');
var ui = function(settings){
  this.settings = settings;
  var init = function(){
    settings.parentElem.innerHTML = "<div></div>";
    util.addClass(settings.parentElem, "gene-expression-atlas-diseases");
    //settings.statusBar = settings.parentElem.querySelector('.status');
  }
  return {init:init}
};

module.exports = ui;
