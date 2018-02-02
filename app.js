#! /usr/bin/env node

const http = require('http');
const port = process.argv[2] || 3000;

const server = http.createServer(requestHandler);

server.listen(port, err => {
  if(err) {
    return console.error(err);
  }

  console.log(`Server is listening on port ${port}`);
})

function requestHandler(request, response) {

}


