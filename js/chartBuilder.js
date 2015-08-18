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
    expressions.push({
      'condition' : expression.condition,
      'expressions' : [{
        'pValue': expression.pValue,
        'tStatistic': expression.tStatistic
      }]
    });
  };
  exDisplayer.originalList = {
    "byName":   sortBy.name(expressions),
    "byTStatistic": expressions.sort(sortBy.tStatistic),
    "byPValue": expressions.sort(sortBy.pValue)
  };
  exDisplayer.createPeaks();
  exDisplayer.updateGlobalPeaks();
  console.log('originalList',exDisplayer.originalList);
  console.log('peaks',exDisplayer.peaks);
};

/**
!!!!!!!
TODO: buggy right now because the sort order is problematic. Should work when we fix that.
!!!!!!!!!
 **/
exDisplayer.createPeaks = function() {
  var down = exDisplayer.originalList.byTStatistic[0].expressions[0].tStatistic,
  up = exDisplayer.originalList.byTStatistic[exDisplayer.originalList.byTStatistic.length-1].expressions[0].tStatistic;

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
