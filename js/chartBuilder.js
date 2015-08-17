var jQuery = require('jquery');
var geneExpressionAtlasDiseasesDisplayer = {};
geneExpressionAtlasDiseasesDisplayer.settingsUpdated = function() {
  jQuery("#gene-expression-atlas-diseases div.settings input.update").removeClass('inactive');
};

geneExpressionAtlasDiseasesDisplayer.prepareOriginalList = function(response){
  var expressions = [], expression;
  for(var i=0; i < response[0].atlasExpression.length; i++){
    expression = response[0].atlasExpression[i];
    expressions.push({
      'pValue': expression.pValue,
      'tStatistic': expression.tStatistic
    });
  }
  return expressions;
}

module.exports = geneExpressionAtlasDiseasesDisplayer;
/*
 // load Goog, create the initial bag from Java, determine max t-stat peak --%>
 (function() {

  // Java to JavaScript --%>
  geneExpressionAtlasDiseasesDisplayer.originalList =
      {"byName": new Array(), "byTStatistic": new Array(), "byPValue": new Array()};
  geneExpressionAtlasDiseasesDisplayer.peaks = {"up": 0, "down": 0};



  // ordered by organ part --%>
  <c:forEach var="cellType" items="${expressions.byName}">
    var expressions = new Array();
    <c:set var="cell" value="${cellType.value}"/>
    <c:forEach var="expression" items="${cell.values}">
      var tStatistic = ${expression.tStatistic};
      var expression = {
        'pValue': ${expression.pValue},
        'tStatistic': tStatistic
      };
      expressions.push(expression);

      // figure out min/max scale --%>
      if (tStatistic > 0) {
        if (tStatistic > geneExpressionAtlasDiseasesDisplayer.peaks.up) {
            geneExpressionAtlasDiseasesDisplayer.peaks.up = tStatistic;
        }
      } else {
        if (tStatistic < geneExpressionAtlasDiseasesDisplayer.peaks.down) {
            geneExpressionAtlasDiseasesDisplayer.peaks.down = tStatistic;
        }
      }
    </c:forEach>

    var expression = {
      'condition': '${cellType.key}',
      'expressions': expressions
    };
    geneExpressionAtlasDiseasesDisplayer.originalList.byName.push(expression);
  </c:forEach>

  // ordered by t-statistic --%>
  <c:forEach var="cellType" items="${expressions.byTStatistic}">
    var expressions = new Array();
    <c:set var="cell" value="${cellType.value}"/>
    <c:forEach var="expression" items="${cell.values}">
      var expression = {
        'pValue': ${expression.pValue},
        'tStatistic': ${expression.tStatistic}
      };
      expressions.push(expression);
    </c:forEach>

    var expression = {
      'condition': '${cellType.key}',
      'expressions': expressions
    };
    geneExpressionAtlasDiseasesDisplayer.originalList.byTStatistic.push(expression);
  </c:forEach>

  // ordered by p-value --%>
  <c:forEach var="cellType" items="${expressions.byPValue}">
    var expressions = new Array();
    <c:set var="cell" value="${cellType.value}"/>
    <c:forEach var="expression" items="${cell.values}">
      var expression = {
        'pValue': ${expression.pValue},
        'tStatistic': ${expression.tStatistic}
      };
      expressions.push(expression);
    </c:forEach>

    var expression = {
      'condition': '${cellType.key}',
      'expressions': expressions
    };
    geneExpressionAtlasDiseasesDisplayer.originalList.byPValue.push(expression);
  </c:forEach>

  // set global t-stat peak for slider --%>
  geneExpressionAtlasDiseasesDisplayer.peaks.global =
  (geneExpressionAtlasDiseasesDisplayer.peaks.up > Math.abs(geneExpressionAtlasDiseasesDisplayer.peaks.down)) ?
  geneExpressionAtlasDiseasesDisplayer.peaks.up : Math.abs(geneExpressionAtlasDiseasesDisplayer.peaks.down);
 })();
*/
