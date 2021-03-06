#! /usr/bin/env node

const express = require('express');
const app = express();
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const minify = require('express-minify');
const compression = require('compression');

const port = process.env.PORT || 3000;
const api = process.env.API || false;
const dev = process.env.DEV || false;
const mainUrl = process.env.MAIN_URL || "http://localhost:3000";
const apiUrl = process.env.API_URL || "http://localhost:3001";

const cats = require('./cats.json');

app.use(sassMiddleware({
  src: path.resolve(__dirname, 'scss'),
  dest: path.resolve(__dirname, 'public'),
  debug: dev,
  outputStyle: 'compressed'
}));
app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, 'views'));
app.use(compression());
app.use(minify());
app.use(express.static('./public'));

app.get('/', (request, response) => {
  if(api) {
    console.log(`API MODE: ${api}`)
    return response.render('api.pug', {title: "Cat dating API", apiUrl});
  }
  response.render('index.pug', { apiUrl, title: "Learn AJAX with cat dating!" });
});

function allowCors(request, response, next) {
    response.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
  });
  next();
}

// get cats from same origin
app.get('/cats.json', (request, response) => {
  response.set({
    // disable cors
    'Access-Control-Allow-Origin': apiUrl,
    'Access-Control-Allow-Headers': ''
  });
  response.json(cats);
});

// get cats via JSONP
app.get('/cats.jsonp', (request, response) => {
  response.jsonp(cats);
});

// get cats from a different domain with CORS enabled
app.get('/cors/cats.json', allowCors, (request,response) => {
  response.json(cats);
});

app.get('/cat/:id/json', allowCors, (request, response) => {
  if(!api) return response.status(403).end();
  var id = request.params.id;
  var cat = cats.filter(cat => cat.id === id)[0];
  if(!cat) return response.status(404).json({error: "Cat does not exist"})
  response.json(cat);
});

app.get('/cat/:id', (request, response) => {
  if(api) return response.status(403).end();
  var id = request.params.id;
  var cat = cats.filter(cat => cat.id === id)[0];
  if(!cat) return response.render('404.pug', {title: "Cat not found!"});
  response.render('cat.pug', { ...cat, title: `Meet ${cat.name}` });
})

app.listen(port, err => {
  if(err) {
    return console.error(err);
  }
  if(dev) {
    console.log(`[${new Date().toLocaleString('en-US', {hour: 'numeric', minute: 'numeric'})}] ${api ? 'API server' : 'Server'} listening on port ${port}`);
  }
});
