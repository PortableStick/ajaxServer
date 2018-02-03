#! /usr/bin/env node

const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT || 3000;
const api = process.env.API || false;
const dev = process.env.DEV || false;

const users = require('./users.json');

if(!api) {
  app.use(express.static('.'));
}

app.get('/', (request, response) => {
  if(api) {
    console.log(`API MODE: ${api}`)
    return response.send("API MODE");
  }
  response.sendFile(path.join(__dirname, 'index.html'));
});

// get users from same origin
app.get('/users.json', (request, response) => {
  response.set({
    // disable cors
    'Access-Control-Allow-Origin': '',
    'Access-Control-Allow-Headers': ''
  });
  response.json(users);
});

// get users via JSONP
app.get('/users.jsonp', (request, response) => {
  response.jsonp(users);
});

// get users from a different domain with CORS enabled
app.get('/cors/users', (request,response) => {
  response.set({
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
  });
  response.json(users);
});

app.listen(port, err => {
  if(err) {
    return console.error(err);
  }
  if(dev) {
    console.log(`[${new Date().toLocaleString('en-US', {hour: 'numeric', minute: 'numeric'})}] ${api ? 'API server' : 'Server'} listening on port ${port}`);
  }
});
