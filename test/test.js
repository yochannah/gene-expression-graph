var assert = require("assert"),
sorter = require('../js/sorter.js'),
list = require('./originalList'),
df = require('../js/dataFormatter.js');

var sortBy = sorter();

console.log("===");
describe('Sorter behaviour', function(){

  var sorted = list.sort(sortBy.tStatistic);
  it("should have the lowest numbers at the start", function(){
    assert(list[0].expressions[0].tStatistic === -16.1);
  });

  it("should have the highest numbers at the end", function(){
    assert(list[list.length-1].expressions[0].tStatistic === 12.2);
  });

  it("should NOT have smallest decimals at the end", function(){
    //this occurs when for some reason the data are sorted by absolute value,
    //not by value. e.g. -1 will come in beside positive 1.
    assert(list[list.length-1].expressions[0].tStatistic !== 0.1);
  });


});
console.log("Running tests at " + new Date().toString() + ":");
console.log("===");
