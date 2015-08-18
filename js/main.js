var imjs      = require('imjs'),
_             = require('underscore'),
query         = require('./query'),
diexUi        = require('./ui'),
diexData      = require('./dataFormatter'),
strings       = require('./strings');

var diex = function(args){ //diex = disease + expression.
  var settings = _.extend({},args);
  init();
  var data;

  function init() {
    console.log('initialising');
    if(validateParent()) {
      ui = new diexUi(settings);
      var mine = validateServiceRoot();
      if(prepQuery() && mine) {
        mine.records(query).then(function(response) {
          console.debug('response:', response, 'settingsdata:', settings);
          if (response.length > 0) {
            try {
            data = diexData.prepareOriginalList(response);

            console.log(data.list.byTStatistic);

            ui.init(data);

          } catch(e){console.error(e);}
          } else {
            ui.init(strings.user.noResults);
          }
        });
      }
    }
  };
  /**
   * Checks if there is indeed an element to attach to, and failing that tries a default.
   * @return {boolean} whether or not we've found an element to attach to. Allows you to cancel the xhr
   *                          since there's nowhere to render it to.
   */
  function validateParent() {
    console.log(settings);
      if(!settings.parentElem){
        var defaultElem = document.getElementById('gene-expression-atlas-diseases');
        if(defaultElem) {
          settings.parentElem = defaultElem;
          console.info(strings.dev.noParent.usingDefault);
        } else {
          console.error(strings.dev.noParent.noDefault);
          return false;
        }
      }
      return true;
    };
    function validateServiceRoot(){
      if(settings.service){
        return new imjs.Service({
          token: settings.service.token,
          root: settings.service.root,
          errorHandler : badServiceError
        });
      } else {
        throw new initError('noServiceUrl');
        return false;
      }

    }
    function prepQuery() {
      if(settings.queryOn) {
        _.extend(query.where[0],settings.queryOn);
        query.where[1].value = settings.expressionType;
        return true;
      } else {

        throw new initError('noQueryData');
        return false;
      }
    }

    /**
     * throw this error to console.error and display a user-facing error too
     * @param  {string} devMessage  this should be the key to a string in the strings.dev object.
     * @param  {[type]} userMessage optional - this should be the key to a string in the strings.user object. If not set, it will use the generic strings.user.noQuery message.
     */
    function initError(devMessage, userMessage){
      var um = userMessage ? userMessage : "noQueryData";
      ui.init(strings.user[um]);
      console.error(strings.dev[devMessage]);
    }
    /**
     * helper method for calling services from imjs. Useful because we can only pass a reference to a functtion (without args) to imjs, so passing initError wouldn't allow us to set the dev error message.
     * @return {[type]} [description]
     */
    function badServiceError(){
        throw new initError('badServiceUrl');
    }
  }

//write tests in test.js

module.exports = diex;
