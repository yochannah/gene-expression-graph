var util = require('./util'),
template = require('../template/basechart.html'),
jQuery = require('jquery'),
sidebarTemplate = require('../template/sidebar.html');
var ui = function(settings) {
  this.settings = settings;
  var originalList,
  newList,
  peaks,
  currentFilter = {
    pValue : 0.0001,
    tStatistic : 4,
    regulationType : ["UP", "DOWN"]
  };

  var init = function(data) {
      settings.parentElem.innerHTML = template;
      settings.statusBar = settings.parentElem.querySelector('.status');
      util.removeClass(settings.statusBar, "loader");
      settings.parentElem.appendChild(getSidebar());
      util.addClass(settings.parentElem, "gene-expression-atlas-diseases");
      settings.statusBar = settings.parentElem.querySelector('.status');
      originalList = data.list;
      peaks = data.peaks;

      listeners();

    },
    getCurrentFilter = function(){
      console.warn("GetCurrentFilter not implemented");
      return currentFilter;
    },
    getSidebar = function() {
      var sidebar = document.createElement("div");
      util.addClass(sidebar, "sidebar");
      sidebar.innerHTML = sidebarTemplate;
      return sidebar;
    },
    drawChart = function(liszt, redraw) {
      if (liszt.length > 0) {
        googleChart();
      } else {
        notify('Nothing to show, adjust the p-value and/or t-stat to see upto ' + originalList.byName.length + ' results', true);
      }

      // the Goog draws here --%>
      function googleChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Cell type');

        data.addColumn('number', 'Downregulation, high p-value');
        data.addColumn('number', 'Downregulation');
        data.addColumn('number', 'Upregulation');
        data.addColumn('number', 'Upregulation, high p-value');

        var chartDirections = {
          'up': false,
          'down': false
        };

        var n = 0;
        // for each cell type --%>
        for (x in liszt) {
          var cellType = liszt[x];
          data.addRows(cellType.expressions.length);

          // for each expression (one bar) in this cell type --%>
          for (y in cellType.expressions) {
            var expression = cellType.expressions[y];
            var tStatistic = expression.tStatistic;
            data.setValue(n, 0, cellType.tissue);

            var formattedString = '\n' + tStatistic + ' (t-statistic)\n' + expression.pValue + ' (p-value)';

            if (tStatistic > 0) { // UP --%>
              // low confidence? --%>
              if (currentFilter.pValue < expression.pValue) {
                data.setValue(n, 1, 0);
                data.setValue(n, 2, 0);
                data.setValue(n, 3, 0);
                data.setValue(n, 4, tStatistic);

                data.setFormattedValue(n, 4, formattedString);
              } else {
                data.setValue(n, 1, 0);
                data.setValue(n, 2, 0);
                data.setValue(n, 3, tStatistic);
                data.setValue(n, 4, 0);

                data.setFormattedValue(n, 3, formattedString);
              }

              chartDirections.up = true;
            } else { // DOWN --%>
              // low confidence? --%>
              if (currentFilter.pValue < expression.pValue) {
                data.setValue(n, 1, tStatistic);
                data.setValue(n, 2, 0);
                data.setValue(n, 3, 0);
                data.setValue(n, 4, 0);

                data.setFormattedValue(n, 1, formattedString);
              } else {
                data.setValue(n, 1, 0);
                data.setValue(n, 2, tStatistic);
                data.setValue(n, 3, 0);
                data.setValue(n, 4, 0);

                data.setFormattedValue(n, 2, formattedString);
              }

              chartDirections.down = true;
            }

            n++;
          }
        }

        // modify the chart properties --%>
        var options = {
          isStacked: true,
          width: windowSize() / 2.2,
          height: (9 * n) + 50,
          chartArea: {
            left: windowSize() / 4,
            top: 0,
            height: 9 * n
          },
          backgroundColor: ["0", "CCCCCC", "0.2", "FFFFFF", "0.2"],
          colors: ['#C9C9FF', '#0000FF', '#59BB14', '#B5E196'],
          fontName: "Lucida Grande,Verdana,Geneva,Lucida,Helvetica,Arial,sans-serif",
          fontSize: 11,
          vAxis: {
            title: 'Tissue',
            titleTextStyle: {
              color: '#1F7492'
            }
          },
          hAxis: 'none',
          legend: 'none',
          hAxis: {
            minValue: peaks.down - 2,
            maxValue: peaks.up + 2
          }
        };

        // TODO: switch off any loading messages

        var chart = new google.visualization.BarChart(settings.parentElem.querySelector('.chart'));
        chart.draw(data, options);

        // attach the hAxis as it does not work natively
        jQuery('<span/>', {
          text: 'expression (t-statistic)'
        }).appendTo(settings.parentElem.querySelector('.chart'));
      }
    },
    filterAndDrawChart = function(redraw) {
        // TODO: chart loading msg

        //YY TODO: This thing here won't work.
        var filters = getCurrentFilter();

        // should the expression be included? --%>
        function iCanIncludeExpression(expression, filters) {
          // regulation type (UP/DOWN/NONE) --%>
          if ("regulationType" in filters) {
            if (expression.tStatistic > 0) {
              if (filters.regulationType.indexOf("UP") < 0) {
                return false;
              }
            } else {
              if (expression.tStatistic < 0) {
                if (filters.regulationType.indexOf("DOWN") < 0) {
                  return false;
                }
              } else {
                if (filters.regulationType.indexOf("NONE") < 0) return false;
              }
            }
          }

          // t-statistic --%>
          if ("tStatistic" in filters) {
            if (Math.abs(expression.tStatistic) < filters.tStatistic) {
              return false;
            }
          }

          // all fine --%>
          return true;
        }

        // go through the original list here (based on sort order) --%>
        var origList = originalList[getSortOrder()];
//        console.log(JSON.stringify(origList));
        var liszt = new Array();
        if (filters) {
          for (x in origList) {
            var oldCellType = origList[x];
            var newExpressions = new Array();
            // traverse the unfiltered expressions --%>
            for (y in oldCellType.expressions) {
              var expression = oldCellType.expressions[y];
              // I can not haz dis 1? --%>
              if (iCanIncludeExpression(expression, filters)) {
                newExpressions.push(expression);
              }
            }

            if (newExpressions.length > 0) { // one/some expression(s) met the bar --%>
              var newCellType = {
                'tissue': oldCellType.condition,
                'expressions': newExpressions
              };
              liszt.push(newCellType);
            }
          }
        } else {
          liszt = originalList[getSortOrder()];
        }

        newList = liszt;
        // re-/draw the chart --%>
        drawChart(liszt, redraw);
      },
      geneExpressionTissuesInitFilter = function() {
        // regulation type (UP/DOWN/NONE) --%>
        currentFilter.regulationType = new Array('UP', 'DOWN');

        //TODO: THIS VALUE, I JUST MADE UP. PUT SOMETHING SENSIBLE
        // p-value --%>
        currentFilter.pValue = 1;

        // t-statistic --%>
        currentFilter.tStatistic = 1;
      },
      geneExpressionTissuesUpdateCurrentFilter = function() {
        // regulation type (UP/DOWN/NONE) --%>
        currentFilter.regulationType = new Array();
        jQuery(settings.parentElem).find("div.settings fieldset.regulation-type input:checked").each(function() {
          currentFilter.regulationType.push(jQuery(this).attr('title'));
        });

        // p-value --%>
        currentFilter.pValue = jQuery(settings.parentElem).find("div.settings fieldset.p-value input.value").val();

        // t-statistic --%>
        currentFilter.tStatistic = jQuery(settings.parentElem).find("div.settings fieldset.t-statistic input.value").val();

        //TODO: Figure out what this is supposed to do exactly?
        jQuery("#gene-expression-atlas-tissues-chart-organism_part.chart").empty();
      },
      // what is the current sort order --%>
      getSortOrder = function() {
          if (!jQuery(settings.parentElem).find('div.settings ul.sort').length) {
              return 'byTStatistic'; // settings do not exist yet --%>
          } else {
              return jQuery(settings.parentElem).find("div.settings ul.sort li.active").attr('title');
          }
      },

      // show message in place of the chart --%>
      notify = function(message, clear) {
        if (clear) settings.parentElem.innerHTML = "";
        noResults(message);
      },
      noResults = function (message) {
        settings.statusBar.className = "status no-results";
        settings.statusBar.innerHTML = message;
      },
      // get the browser window size --%>
      windowSize = function() {
          return jQuery(window).width();
      },
      listeners = function(){

        // resize chart on browser window resize --%>
        jQuery(window).resize(function() {
          if (this.resz) clearTimeout(this.resz);
          this.resz = setTimeout(function() {
            filterAndDrawChart(true);
          }, 500);
        });

        // attache events to the sidebar settings, set as filters and redraw --%>
        jQuery(settings.parentElem).find("div.settings input.update").click(function() {
          geneExpressionTissuesUpdateCurrentFilter();
          // redraw --%>
          filterAndDrawChart(true);
          // update button not highlighted --%>
          jQuery(this).addClass('inactive');
        });

        // attache switcher for sort order --%>
        jQuery(settings.parentElem).find("div.settings ul.sort li").click(function() {
          jQuery(settings.parentElem).find("div.settings ul.sort li.active").removeClass('active');
          jQuery(this).addClass('active');
          geneExpressionTissuesUpdateCurrentFilter();
          filterAndDrawChart(true);
        });

        // attache monitoring for regulation type checkbox change --%>
        jQuery(settings.parentElem).find("div.settings fieldset.regulation-type input").click(function() {
          console.warn("Click handler not implemented yet");
        });
      };

      google.load("visualization", "1", {"packages":["corechart"], "callback":filterAndDrawChart});

    return {
      init: init,
      getSortOrder : getSortOrder
    }
};

module.exports = ui;
