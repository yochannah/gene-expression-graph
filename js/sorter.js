var sorter = function(){
  var sortByHelper = function(itema, itemb,sortBy){
  return itema.expressions[0][sortBy] - itemb.expressions[0][sortBy];
  },
  sortByPValue = function(itema, itemb) {
  return sortByHelper(itema, itemb, "pValue");
  },
  sortByTStatistic = function(itema, itemb) {
    return sortByHelper(itema, itemb, "tStatistic");
  },
  sortByName = function(arr) {
    var tempArray = arr.map(function(el, i) {
      return { index: i, value: el.condition.toLowerCase() };
    });

    tempArray.sort(function(itema, itemb) {
      return +(itema.value > itemb.value) || +(itema.value === itemb.value) - 1;
    });
    return tempArray.map(function(elem){
      return arr[elem.index];
    });
  };
  return {
    pValue : sortByPValue,
    tStatistic : sortByTStatistic,
    name : sortByName
  };
};

module.exports = sorter;
