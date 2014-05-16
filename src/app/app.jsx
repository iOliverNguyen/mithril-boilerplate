var home = require('home/home');
var app = {};

app.ProductList = function() {
  return m.request({method: 'GET', url: '../products.json'});
};

app.controller = function() {
  this.products = app.ProductList();
  this.filterText = m.prop('');
  this.inStockOnly = m.prop(false);
};

INJECT('app.view');

m.module(document.body, app);
