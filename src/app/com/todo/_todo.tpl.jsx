<div class="todo">
  <form onsubmit={u.silence()}>
    <input type="text" onchange={m.withAttr('value', ctrl.description)} value={ctrl.description()}/>
    <button onclick={ctrl.add}>Add</button>
  </form><br/>
  <ul>
    {ctrl.list.map(function(task, index) {
      return <li>
        <input type="checkbox" id={'task_' + index} checked={task.done()} onclick={m.withAttr('checked', task.done)} /> &nbsp;
        <label class={task.done()? 'done': ''} for={'task_' + index}>{task.description()}</label>
      </li>;
    })}
  </ul>
</div>
