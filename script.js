$(function() {
  var $sameDomainButton = $('#sameDomain');
  var $jsonpButton = $('#jsonp');
  var $usersList = $('#users');

  $sameDomainButton.click(e => {
    fetch('/users')
      .then(response => response.json())
      .then(console.log)
  });

  $jsonpButton.click(e => {
    $.getJSON('http://localhost:3001/users.jsonp?callback=?')
      .then(response => {
        console.log(response);
      })

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

})

