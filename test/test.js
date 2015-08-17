var assert = require("assert"),
main = require('../js/main.js')


console.log("===");
describe('A test', function(){

  it('should pass',function() {
    assert("0" !== 0);
  });

  it('should return hi from the hello world main js function',function() {
    var hello = main();
    assert(hello === "hi");
    assert(hello !== "bye");
  });


});
console.log("Running tests at " + new Date().toString() + ":");
console.log("===");
