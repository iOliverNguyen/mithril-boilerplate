var shift = Array.prototype.shift;
var unshift = Array.prototype.unshift;
var slice = Array.prototype.slice;

exports.eachFunc = function() {
  var funcs = arguments;
  return function() {
    for (var i=0; i < funcs.length; i++) {
      funcs[i].apply(this, arguments);
    }
  };
};

exports.init = function($module) {
  var ctrl = {};
  var obj = Object.create(ctrl);
  $module.controller.apply(ctrl, slice.call(arguments, 1));
  obj.$module = $module;
  obj.$view = $module.view.bind({}, ctrl);
  return obj;
};

exports.silence = function(cb) {
  return function(e) {
    e.preventDefault();
    if (cb) return cb();
  };
};
