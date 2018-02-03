const FADEOUT_DELAY = 200;
const FADEIN_DELAY = 200;

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
    return $.getJSON(url)
      .then(successHandler, errorHandler);
  }

  $sameDomainButton.click(e => {
    clearEach($usersList)
      .then(() => sendRequest('/users.json'))
  });

  $crossDomainButton.click(e => {
    clearEach($usersList)
      .then(() => sendRequest('http://localhost:3001/users.json'))
  });

  $jsonpButton.click(e => {
    clearEach($usersList)
      .then(() => sendRequest('http://localhost:3001/users.jsonp?callback=?'))
  });

  $corsButton.click(e => {
    clearEach($usersList)
      .then(() => sendRequest('http://localhost:3001/cors/users'))
  });
});

function clearEach($target) {
  var children = $target.children().toArray().reverse();
  var events = $.map(children, (child, i) => $(child).delay(i * FADEOUT_DELAY).fadeOut().promise())

  return new Promise((resolve, reject) => {
    $.when(...events)
      .then(() => $target.html(''))
      .then(resolve)
      .catch(reject)
  })
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
}

function renderError(template, $target, jqXHR) {
  $target.html(template(jqXHR));
}
