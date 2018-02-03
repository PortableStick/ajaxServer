const FADEOUT_DELAY = 200;
const FADEIN_DELAY = 250;
var FETCHING = false;

$(function() {
  var $sameDomainButton = $('#sameDomain');
  var $crossDomainButton = $('#crossDomain');
  var $corsButton = $('#cors');
  var $jsonpButton = $('#jsonp');
  var $usersList = $('#users');

  var userTemplate = Handlebars.compile($('#user-template').html());
  var errorTemplate = Handlebars.compile($('#error-template').html());

  var successHandler = renderData.bind(this, userTemplate, $usersList);
  var errorHandler = renderError.bind(this, errorTemplate, $usersList);

  function sendRequest(url) {
    if(FETCHING) return;
    FETCHING = true;
    return clearEach($usersList)
      .then(() => $.getJSON(url))
      .then(successHandler, errorHandler);
  }

  $sameDomainButton.click(e => sendRequest('/users.json'));

  $crossDomainButton.click(e => sendRequest('http://localhost:3001/users.json'));

  $jsonpButton.click(e => sendRequest('http://localhost:3001/users.jsonp?callback=?'));

  $corsButton.click(e => sendRequest('http://localhost:3001/cors/users'));
});

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
