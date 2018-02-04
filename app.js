#! /usr/bin/env node

const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT || 3000;
const api = process.env.API || false;
const dev = process.env.DEV || false;
const mainUrl = process.env.MAIN_URL || "http://localhost:3000";
const apiUrl = process.env.API_URL || "http://localhost:3001";

const cats = require('./cats.json');

app.use(express.static('.'));
app.set('view engine', 'pug')

app.get('/', (request, response) => {
  if(api) {
    console.log(`API MODE: ${api}`)
    return response.send("API MODE");
  }
  response.render(path.join(__dirname, 'index.pug'), { apiUrl });
});

// get cats from same origin
app.get('/cats.json', (request, response) => {
  response.set({
    // disable cors
    'Access-Control-Allow-Origin': 'notallowed.donotenter',
    'Access-Control-Allow-Headers': ''
  });
  response.json(cats);
});

// get cats via JSONP
app.get('/cats.jsonp', (request, response) => {
  response.jsonp(cats);
});

// get cats from a different domain with CORS enabled
app.get('/cors/cats.json', (request,response) => {
  response.set({
    "Access-Control-Allow-Origin": mainUrl,
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
  });
  response.json(cats);
});

app.listen(port, err => {
  if(err) {
    return console.error(err);
  }
  if(dev) {
    console.log(`[${new Date().toLocaleString('en-US', {hour: 'numeric', minute: 'numeric'})}] ${api ? 'API server' : 'Server'} listening on port ${port}`);
  }
});
