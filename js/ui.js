var util = require('./util'),
template = require('../template/basechart.html'),
sidebarTemplate = require('../template/sidebar.html');
var ui = function(settings){
  this.settings = settings;
  var init = function(){
    settings.parentElem.innerHTML = template;
    settings.statusBar = settings.parentElem.querySelector('.status');
    util.removeClass(settings.statusBar,"loader");
    settings.parentElem.appendChild(getSidebar());
    util.addClass(settings.parentElem, "gene-expression-atlas-diseases");
    settings.statusBar = settings.parentElem.querySelector('.status');
  },
  getSidebar = function(){
    var sidebar = document.createElement("div");
    sidebar.innerHTML = sidebarTemplate;
    return sidebar;
  };
  return {init:init}
};

module.exports = ui;
