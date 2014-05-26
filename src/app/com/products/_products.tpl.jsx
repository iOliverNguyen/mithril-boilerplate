<div class="products">
  <form onsubmit={u.silence()}>
    <input placeholder="Search..." value={ctrl.filterText()} onkeyup={m.withAttr('value', ctrl.filterText)} />
    <p>
      <input type="checkbox" checked={ctrl.inStockOnly()} onchange={m.withAttr('checked',ctrl.inStockOnly)} />
      Only show products in stock
    </p>
  </form>
  <table>
    <thead>
      <tr><th>Name</th><th>Price</th></tr>
    </thead>
    <tbody>
      {rows}
    </tbody>
  </table>
</div>
