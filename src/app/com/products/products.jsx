var u = require('com/u');

function ProductList() {
  return m.request({method:'GET', url:'products.json'});
}

function controller() {
  this.products = ProductList();
  this.filterText = m.prop("");
  this.inStockOnly = m.prop(false);
}

function view(ctrl) {
  var rows = [];
  var lastCategory = null;

  ctrl.products().forEach(function(p) {
    if (p.name.indexOf(ctrl.filterText()) === -1 ||
      (!p.stocked && ctrl.inStockOnly())) {
      return;
    }

    if (p.category !== lastCategory) {
      rows.push(m('tr', [
        m('th', {colspan: 2}, p.category)
      ]));
      lastCategory = p.category;
    }

    rows.push(
      m('tr', [
        m('td', {style: p.stocked ? {} : {color: 'red'}}, p.name),
        m('td', {}, p.price)
      ])
    );
  });

  return INCLUDE('com/products/products.tpl');
}

exports.label = 'Products';
exports.controller = controller;
exports.view = view;
