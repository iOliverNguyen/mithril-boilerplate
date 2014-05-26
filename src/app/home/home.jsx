var products = require('com/products/products');
var tabs = require('com/tabs/tabs');
var todo = require('com/todo/todo');
var u = require('com/u');

exports.controller = function() {
  this.tabs = u.init(tabs({
    label: 'Todo',
    module: todo
  }, {
    label: 'Product List',
    module: products
  }));
};

exports.view = function(ctrl) {

  function description() {
    var index = ctrl.tabs.index();
    return index === 0? INCLUDE('home/todo.tpl') : INCLUDE('home/products.tpl');
  }

  return INCLUDE('home/home.tpl');
};
