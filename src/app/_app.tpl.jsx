<div>
  <form>
    <input placeholder="Search..." onkeyup={m.withAttr('value', ctrl.filterText)} value={ctrl.filterText()}/>
    <p>
      <input type="checkbox" onchange={m.withAttr('checked', ctrl.inStockOnly)}/>
      Only show products in stock
    </pk>
  </form>
  <table>
    <thead>
      <tr><th>Name</th><th>Price</th></tr>
    </thead>
    <tbody>
      {app.rows(ctrl)}
    </tbody>
  </table>
</div>
