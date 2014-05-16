app.rows = function(ctrl) {
  var rows = [];
  var lastCategory = null;

  ctrl.products().forEach(function(p) {
    if (p.name.indexOf(ctrl.filterText()) === -1 ||
      (!p.stocked && ctrl.inStockOnly())) {
      return;
    }

    if (p.category !== lastCategory) {
      rows.push(
        <tr>
          <th colspan="2">{p.category}</th>
        </tr>
      );
      lastCategory = p.category;
    }

    rows.push(
      <tr>
        <td class={p.stocked? '' : 'red'}>{p.name}</td>
        <td>{p.price}</td>
      </tr>
    );
  });

  return rows;
};

app.view = function(ctrl) {
  return INJECT('app.tpl');
};
