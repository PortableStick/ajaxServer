#! /usr/bin/env node

const express = require('express');
const app = express();
const path = require('path');
const sassMiddleware = require('node-sass-middleware');

const port = process.env.PORT || 3000;
const api = process.env.API || false;
const dev = process.env.DEV || false;
const mainUrl = process.env.MAIN_URL || "http://localhost:3000";
const apiUrl = process.env.API_URL || "http://localhost:3001";

const cats = require('./cats.json');

app.use(sassMiddleware({
  src: __dirname,
  dest: __dirname,
  debug: dev,
  outputStyle: 'compressed'
}));

app.use(express.static('.'));
app.set('view engine', 'pug');

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

app.get('/cat/:id/json', (request, response) => {
  var id = request.params.id;
  var cat = cats.filter(cat => cat.id === id)[0];
  if(!cat) return response.status(404).json({error: "Cat does not exist"})
  response.json(cat);
});

app.get('/cat/:id', (request, response) => {
  var id = request.params.id;
  var cat = cats.filter(cat => cat.id === id)[0];
  if(!cat) return response.render(path.join(__dirname, '404.pug'));
  response.render(path.join(__dirname, 'cat.pug'), { ...cat });
})

app.listen(port, err => {
  if(err) {
    return console.error(err);
  }
  if(dev) {
    console.log(`[${new Date().toLocaleString('en-US', {hour: 'numeric', minute: 'numeric'})}] ${api ? 'API server' : 'Server'} listening on port ${port}`);
  }
});
