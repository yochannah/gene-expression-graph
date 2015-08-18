var jQuery  = require('jquery'),
sorter      = require('./sorter');

var exDisplayer = {};
exDisplayer.settingsUpdated = function() {
  jQuery("#gene-expression-atlas-diseases div.settings input.update").removeClass('inactive');
};

exDisplayer.originalList = {};
exDisplayer.newList = [];
exDisplayer.peaks = {"up": 0, "down": 0};
exDisplayer.prepareOriginalList = function(response){
  var expressions = [], expression,
  sortBy = sorter();
  for(var i=0; i < response[0].atlasExpression.length; i++){
    expression = response[0].atlasExpression[i];
    if(expression.condition !== "(empty)") {
      expressions.push({
        'condition' : expression.condition,
        'expressions' : [{
          'pValue': expression.pValue,
          'tStatistic': expression.tStatistic
        }]
      });
    }
  };
  // debug. The list should remain sorted from positive to negative. arg. 
  // var arg = expressions.sort(sortBy.tStatistic);
  // for (var i = 0; i < arg.length; i++) {
  //   console.log(arg[i].expressions[0]);
  // }

  exDisplayer.originalList = {
    "byName":   sortBy.name(expressions),
    "byTStatistic": expressions.sort(sortBy.tStatistic),
    "byPValue": expressions.sort(sortBy.pValue)
  };

  exDisplayer.createPeaks();
  exDisplayer.updateGlobalPeaks();
  return {
    list : exDisplayer.originalList,
    peaks : exDisplayer.peaks
  };
};

/**
 * Sets peak values to highest and lowest values in the array.
 * Until we fix why the sort order is changing can't just use the last value in the array for up.
 **/
exDisplayer.createPeaks = function() {
  var down = exDisplayer.originalList.byTStatistic[0].expressions[0].tStatistic,
  up = 0, temp;

  for (var i = 0; i < exDisplayer.originalList.byTStatistic.length; i++) {
    temp = exDisplayer.originalList.byTStatistic[i].expressions[0].tStatistic;
    up = (temp > up) ? temp : up;
  }

  exDisplayer.peaks.up = up;
  exDisplayer.peaks.down = down;
};

/**
 * Determines the max tStat peak and updates the peaks property
 */
exDisplayer.updateGlobalPeaks = function() {
  exDisplayer.peaks.global =
  (exDisplayer.peaks.up > Math.abs(exDisplayer.peaks.down)) ?
  exDisplayer.peaks.up : Math.abs(exDisplayer.peaks.down);
}

module.exports = exDisplayer;
