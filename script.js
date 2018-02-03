const FADEOUT_DELAY = 200;
const FADEIN_DELAY = 200;

$(function() {
  var $sameDomainButton = $('#sameDomain');
  var $crossDomainButton = $('#crossDomain');
  var $corsButton = $('#cors');
  var $jsonpButton = $('#jsonp');
  var $usersList = $('#users');
  var userTemplate = Handlebars.compile($('#user-template').html());
  var successHandler = renderData.bind(this, userTemplate, $usersList);

  $sameDomainButton.click(e => {
    clearEach($usersList)
      .then(() => $.getJSON('/users.json'))
      .then(successHandler)
      .catch(handleError);
  });

  $crossDomainButton.click(e => {
    clearEach($usersList)
      .then(() => $.getJSON('http://localhost:3001/users.json'))
      .then(successHandler)
      .catch(handleError);
  });

  $jsonpButton.click(e => {
    clearEach($usersList)
      .then(() => $.getJSON('http://localhost:3001/users.jsonp?callback=?'))
      .then(successHandler)
      .catch(handleError);

      /****
      // * long form
      // *
      $.ajax({
        url: 'http://localhost:3001/jsonp/users',
        dataType: 'jsonp',
        jsonpCallback: 'callbackFunction'
      })

      function callbackFunction(response) {
        console.log(response)
      }

      //long form ****/
  });

  $corsButton.click(e => {
    clearEach($usersList)
      .then(() => $.getJSON('http://localhost:3001/cors/users'))
      .then(successHandler)
      .catch(handleError);
  });
});

function handleError(err) {
  console.log("Handle errrrrrrr")
  console.log(err)
  console.log(err.status)
}

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
