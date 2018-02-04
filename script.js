function init(apiUrl) {

  const FADEOUT_DELAY = 200;
  const FADEIN_DELAY = 250;
  var FETCHING = false;

  Handlebars.registerHelper('linkify', name => name.replace(' ', '_'));
  Handlebars.registerHelper('urlify', image => `${apiUrl}/images/${image}`);

  var $sameDomainButton = $('#sameDomain');
  var $crossDomainButton = $('#crossDomain');
  var $corsButton = $('#cors');
  var $jsonpButton = $('#jsonp');
  var $catsList = $('#cats');

  var catTemplate = Handlebars.compile($('#cat-template').html());
  var errorTemplate = Handlebars.compile($('#error-template').html());

  var successHandler = renderData.bind(this, catTemplate, $catsList);
  var errorHandler = renderError.bind(this, errorTemplate, $catsList);

  function sendRequest(url) {
    if(FETCHING) return;
    FETCHING = true;
    return clearEach($catsList)
      .then(() => $.getJSON(url))
      .then(successHandler, errorHandler);
  }

  $sameDomainButton.click(e => sendRequest('/cats.json'));

  $crossDomainButton.click(e => sendRequest(`${apiUrl}/cats.json`));

  $jsonpButton.click(e => sendRequest(`${apiUrl}/cats.jsonp?callback=?`));

  $corsButton.click(e => sendRequest(`${apiUrl}/cors/cats.json`));

  function clearEach($target) {
    var children = $target.children().toArray().reverse();
    var events = children.map((child, i) => $(child).delay(i * FADEOUT_DELAY).fadeOut().promise());

    return Promise.all(events)
        .then(() => $target.html(''))
  }

  function renderData(template, $target, data) {
      data.forEach((datum, i) => {
        var output = template(datum);
        $(output)
          .hide()
          .appendTo($target)
          .delay(i * FADEIN_DELAY)
          .fadeIn();
      });
      FETCHING = false;
  }

  function renderError(template, $target, jqXHR) {
    var output = template(jqXHR);
    $(output)
      .hide()
      .appendTo($target)
      .fadeIn()
    FETCHING = false;
  }
}
