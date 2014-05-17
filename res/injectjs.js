var gutil = require('gulp-util');
var path = require('path');
var through = require('through2');
var fs = require('fs');

var pluginName = 'injectjs';
var blue = gutil.colors.blue;

function error(context, err) {
  context.emit('error', new gutil.PluginError(pluginName, err));
}

// ignore _* files
// for each file, scan for INJECT('filepath')
// read file contents, continue scanning, check for circular
// cache _* files

function inject(options) {

  options = options || {};
  if (options.cache === undefined) options.cache = false;
  if (options.keyword === undefined) options.keyword = 'INJECT';

  return through.obj(function(file, enc, cb) {
    var context = this;

    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      error(context, new Error('Streaming not supported'));
      return cb();
    }

    // ignore _* files
    var filename = path.basename(file.path);
    if (filename[0] === '_') {
      return cb();
    }

    // for (var i in file) {
    //   console.log(i, file[i]);
    // }

    function exec(s, stack) {
      var result = '';
      var r = new RegExp(options.keyword + ' *\\( *[\'"]([^\'"]*)[\'"] *\\) *;?', 'g');
      var m = r.exec(s);
      while (m) {
        index = m.index;
        result += s.slice(0, m.index) + read(m[1], stack || []);
        s = s.slice(m.index + m[0].length);
        m = r.exec(s);
      }
      return result + s;
    }

    function read(relpath, stack) {
      var basename = path.basename(relpath);
      basename = basename[0] === '_'? basename : '_' + basename;
      basename = path.extname(basename) === 'jsx'? basename : basename + '.jsx';

      var filepath = path.join(file.base || file.cwd, path.dirname(relpath), basename);
      var newStack = stack.concat([filepath]);

      if (stack.indexOf(filepath) >= 0) {
        error(context, new Error('Circular ' + blue(newStack.join(', '))));
        return '';
      }

      try {
        var str = fs.readFileSync(filepath, {encoding: 'utf8'});
        str = exec(str, newStack);
        return str;

      } catch(e) {
        error(context, new Error('Could not read file ' + blue(filepath)));
      }

      return '';
    }

    var str = file.contents.toString();
    try {
      file.contents = new Buffer(exec(str));

    } catch (e) {
      e.filename = file.path;
      error(context, e);
    }

    this.push(file);
    cb();
  });
}

module.exports = inject;
