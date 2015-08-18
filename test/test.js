var assert = require("assert"),
sorter = require('../js/sorter.js'),
list = require('./originalList'),
df = require('../js/dataFormatter.js');

var sortBy = sorter();

console.log("===");
describe('Sorter behaviour', function(){

  var sorted = list.sort(sortBy.tStatistic);
  for(var i =0; i < list.length; i++) {
    console.log(list[i].expressions[0])
  }

});
console.log("Running tests at " + new Date().toString() + ":");
console.log("===");
