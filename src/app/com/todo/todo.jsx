var u = require('com/u');
var todo = exports;

todo.Todo = function(data) {
  this.description = m.prop(data.description);
  this.done = m.prop(false);
};

todo.TodoList = Array;

todo.controller = function() {
  this.list = new todo.TodoList();
  this.description = m.prop("");

  this.addTodo = function(description) {
    this.list.push(new todo.Todo({
      description: description
    }));
  }.bind(this);

  this.add = function() {
    if (this.description()) {
      this.addTodo(this.description());
      this.description("");
    }
  }.bind(this);

  this.addTodo('try next example');
  this.addTodo('learn Mithril');
  this.addTodo('clear this list');
};

todo.view = function(ctrl) {
  return INCLUDE('com/todo/todo.tpl');
};
