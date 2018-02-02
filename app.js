#! /usr/bin/env node

const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT || 3000;
const api = process.env.API || false;
const dev = process.env.DEV || false;

const users = require('./users.json');

app.get('/', (request, response) => {
  if(api) response.send("API MODE");
  response.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/users', (request, response) => {
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
