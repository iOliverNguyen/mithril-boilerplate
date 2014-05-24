// User configs

var configs = {
  buildAppCss: 'build/public/src/app.css',
  buildVendorCss: 'build/public/src/vendor.css',

  buildAssets: 'build/public/assets/',
  buildAssetsVendor: 'build/public/assets/vendor/',
  buildHtml: 'build/public/',
  buildPublic: 'build/public/',
  buildSrc: 'build/public/src/',
  buildTmpSrc: 'build/tmp/src/',
  buildVendor: 'build/public/vendor/',

  compileMainCss: 'main.css',
  compileMainJs: 'main.js',

  compileAssets: 'bin/public/assets/',
  compileAssetsVendor: 'bin/public/assets/vendor/',
  compileHtml: 'bin/public/',
  compilePublic: 'bin/public/',
  compileSrc: 'bin/public/src/',

  appLess: 'src/less/app.less',
  vendorLess: 'src/less/vendor.less',
};

var appFiles = {
  assets: ['src/assets/**/*.*'],
  coffee: ['src/app/**/*.coffee', '!src/app/**/*.spec.coffee'],
  coffeeunit: ['src/app/**/*.spec.coffee'],
  html: ['src/app/index.html'],
  js: ['src/app/**/*.js', '!src/app/**/*.spec.js'],
  jsunit: ['src/app/**/*.spec.js'],
  jsx: ['src/app/**/*.jsx'],
  less: ['src/less/**/*.less', '!' + configs.vendorLess],
  tpl: ['src/app/**/*.tpl.html'],
  root: ['LICENSE', 'README.md', 'public/**/*.*']
};

var vendorFiles = {
  assets: [
    'vendor/bootstrap/fonts/*.*'
  ],
  js: [
    'vendor/mithril/mithril.js',
    'vendor/min-require/min-require.js',
  ],
};

var consts = {
  livereloadPort: 35729,
};

/* -------------------------------------------------------------------------- */
// Implement tasks

var fs = require('fs');
var gulp = require('gulp');
var path = require('path');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

var colors = plugins.util.colors;
var log = plugins.util.log;

function clean(filepath, cb) {
  log('Cleaning', colors.magenta(filepath));
  gulp.src(filepath, {read: false})
    .pipe(plugins.clean({force: false}))
    .on('end', cb || function() {})
    .on('error', log);
}

function revName(filename) {
  var index = filename.search(/\.[^.]*$/);
  return filename.substr(0, index) + '-*' + filename.substr(index);
}

function mainScripts(basepath) {
  return configs.mainScripts.map(function(s) {
    return path.join(basepath, s);
  });
}

function buildStyles(src, destFile, options, cb) {
  gulp.src(src)
    .pipe(plugins.plumber())
    .pipe(plugins.less(options))
    // .pipe(plugins.size({showFiles: true}))
    .pipe(gulp.dest(path.dirname(destFile)))
    .on('end', cb || function(){})
    .on('error', log);
}

// Generate build/public/assets/app-***.css
gulp.task('buildAppStyles',function(cb) {
  buildStyles(configs.appLess, configs.buildAppCss, {sourceMap:true}, cb);
});

// Generate build/public/assets/vendor-***.css
gulp.task('buildVendorStyles', function(cb) {
  buildStyles(configs.vendorLess, configs.buildVendorCss, {sourceMap:false}, cb);
});

// Generate bin/public/assets/main-***.css
gulp.task('compileStyles', function(cb) {
  clean(path.join(configs.compileAssets, revName(configs.compileMainCss)), _compileStyles);

  function _compileStyles() {
    gulp.src([
      configs.buildVendorCss,
      configs.buildAppCss,
    ])
      .pipe(plugins.plumber())
      .pipe(plugins.concat(configs.compileMainCss))
      .pipe(plugins.minifyCss())
      .pipe(plugins.streamify(plugins.rev()))
      .pipe(plugins.size({showFiles: true}))
      .pipe(gulp.dest(configs.compileAssets))
      .on('end', cb || function(){})
      .on('error', log);
  }
});

// Combine *.jsx, wrap them in CommonJs style and store in build/src/app
gulp.task('buildAppScriptsInject', function(cb) {
  var tmpSrcApp = path.join(configs.buildTmpSrc, 'app');
  gulp.src(path.join(tmpSrcApp, '**/*.js'), {base: tmpSrcApp})
    .pipe(plugins.plumber())
    .pipe(plugins.wrapRequire())
    .pipe(plugins.includeJs({ext:'js', cache:true, showFiles:'Building'}))
    // .pipe(plugins.size({showFiles: true}))
    .pipe(gulp.dest(path.join(configs.buildSrc, 'app')))
    .on('end', cb || function(){})
    .on('error', log);
});

// Convert app scripts from .jsx to .js
gulp.task('buildAppScriptsMsx', function(cb) {
  var tmpSrcApp = path.join(configs.buildTmpSrc, 'app');
  gulp.src(appFiles.jsx, {base: 'src/app'})
    .pipe(plugins.plumber())
    .pipe(plugins.changed(tmpSrcApp, {extension: '.js'}))
    .pipe(plugins.msx())
    // .pipe(plugins.sweetjs({modules: ['./res/template-compiler.sjs']}))
    // .pipe(plugins.size({showFiles: true}))
    .pipe(gulp.dest(tmpSrcApp))
    .on('end', cb || function(){})
    .on('error', log);
});

// Note: We only support *.jsx files and ignore all *.js files.
//
// gulp.task('buildAppScriptPlain', function(cb) {
//   gulp.src(appFiles.js, {base: 'src'})
//     .pipe(plugins.size({showFiles: true}))
//     .pipe(gulp.dest(configs.buildSrc))
//     .on('end', cb || function(){})
//     .on('error', log);
// });

// Combine and convert *.jsx
gulp.task('buildAppScripts', function(cb) {
  runSequence('buildAppScriptsMsx', 'buildAppScriptsInject', cb);
});

// Copy vendor scripts to build/public/vendor
gulp.task('buildVendorScripts', function(cb) {
  gulp.src(vendorFiles.js, {base: 'vendor'})
    .pipe(gulp.dest('build/public/vendor'))
    .on('end', cb || function(){})
    .on('error', log);
});

// Concat all scripts to bin/public/assets/main-***.js
gulp.task('compileScripts', function(cb) {
  clean(path.join(configs.compileAssets, revName(configs.compileMainJs)), _compileScripts);

  function _compileScripts() {
    var glob = [].concat(
      vendorFiles.js || [],
      [ path.join(configs.buildSrc, 'app/**/*.js'),
        path.join('!' + configs.buildSrc, 'app/**/_*.js') ]
    );
    gulp.src(glob)
      .pipe(plugins.plumber())
      .pipe(plugins.concat(configs.compileMainJs))
      .pipe(plugins.insert.append('\n\nrequire(\'main\');\n'))
      .pipe(plugins.streamify(plugins.uglify({mangle: true})))
      .pipe(plugins.streamify(plugins.rev()))
      .pipe(plugins.size({showFiles: true}))
      .pipe(gulp.dest(configs.compileAssets))
      .on('end', cb || function() {})
      .on('error', log);
  }
});

// Copy vendor and app assets to build/public/assets
gulp.task('buildAppAssets', function(cb) {
  gulp.src(appFiles.assets, {base: 'src/assets'})
    .pipe(plugins.changed(configs.buildAssets))
    .pipe(gulp.dest(configs.buildAssets))
    .on('end', cb || function(){})
    .on('error', log);
});

gulp.task('buildVendorAssets', function(cb) {
  gulp.src(vendorFiles.assets)
    .pipe(gulp.dest(configs.buildAssetsVendor))
    .on('end', cb || function(){})
    .on('error', log);
});

// Copy assets from build/public/assets to bin/public/assets
gulp.task('compileAssets', function(cb) {
  gulp.src(path.join(configs.buildAssets, '**/*.*'), {base: configs.buildAssets})
    .pipe(gulp.dest(configs.compileAssets))
    .on('end', cb || function(){})
    .on('error', log);
});

function injectHtml(tag, path, glob) {
  return plugins.inject(
    gulp.src(glob, {read:false}), {
      starttag: '<!-- ' + tag + '.{{ext}} -->',
      endtag: '<!-- end -->',
      ignorePath: path,
      sort: function(a,b) {return a < b? -1 : a > b? 1 : 0;}
    }
  );
}

gulp.task('buildIndexHtml', function(cb) {
  gulp.src(appFiles.html)
    .pipe(plugins.plumber())
    .pipe(injectHtml('vendor', configs.buildPublic,
      [
        configs.buildVendorCss,
        path.join(configs.buildVendor, '**/*.js')
      ]
    ))
    .pipe(injectHtml('app', configs.buildPublic,
      [
        configs.buildAppCss,
        path.join(configs.buildSrc, 'app/**/*.js'),
        path.join('!' + configs.buildSrc, 'app/**/_*.js')
      ]
    ))
    .pipe(plugins.insert.append('<script>require(\'main\');</script>'))
    .pipe(plugins.insert.append('<script src="//localhost:' + consts.livereloadPort + '/livereload.js"></script>'))
    // .pipe(plugins.size({showFiles:true}))
    .pipe(gulp.dest(configs.buildHtml))
    .on('end', cb || function(){})
    .on('error', log);
});

gulp.task('compileIndexHtml', function(cb) {
  gulp.src(appFiles.html)
    .pipe(plugins.plumber())
    .pipe(injectHtml('app', configs.compilePublic,
    [
      path.join(configs.compileAssets, revName(configs.compileMainCss)),
      path.join(configs.compileAssets, revName(configs.compileMainJs))
    ]))
    .pipe(plugins.minifyHtml())
    .pipe(plugins.size({showFiles:true}))
    .pipe(gulp.dest(configs.compileHtml))
    .on('end', cb || function(){})
    .on('error', log);
});

gulp.task('buildRootFiles', function(cb) {
  gulp.src(appFiles.root, {base:'.'})
    .pipe(plugins.changed('build'))
    .pipe(gulp.dest('build'))
    .on('end', cb || function(){})
    .on('error', log);
});

gulp.task('compileRootFiles', function(cb) {
  gulp.src(appFiles.root, {base:'.'})
    .pipe(gulp.dest('bin'))
    .on('end', cb || function(){})
    .on('error', log);
});

gulp.task('testAppScripts', function(cb) {
  // TODO
});

/* -------------------------------------------------------------------------- */
// Major tasks

gulp.task('clean', function(cb) {
  clean(['build', 'bin'], cb);
});

gulp.task('build', function(cb) {
  runSequence('clean',[
      'buildAppStyles', 'buildVendorStyles',
      'buildAppScripts', 'buildVendorScripts',
      'buildAppAssets', 'buildVendorAssets',
      'buildRootFiles'
    ],
    'buildIndexHtml',
    cb);
});

gulp.task('compile', function(cb) {
  runSequence('build',
    ['compileStyles', 'compileScripts', 'compileAssets', 'compileRootFiles'],
    'compileIndexHtml',
    cb);
});

gulp.task('default', ['compile']);

// Tasks to run whenever a source file changes
gulp.task('watch', function(cb) {

  var eventColors = {
    added: colors.green,
    changed: colors.magenta,
    deleted: colors.red,
    renamed: colors.green
  };
  function logChanged(e) {
    var c = eventColors[e.type] || colors.white;
    log('[' + c(e.type) + ']', colors.magenta(path.relative(process.cwd(), e.path)));
  }

  var lr = plugins.livereload(consts.livereloadPort);
  function runTasks() {
    var args = arguments;
    return function(e){ runSequence.apply(this, args); };
  }
  function reload(filepath) {
    return function(cb){ lr.changed(filepath); };
  }

  var indexHtmlPath = 'index.html';

  gulp.watch(appFiles.assets, runTasks('buildAppAssets'));
  gulp.watch(appFiles.less, runTasks('buildAppStyles', reload(configs.buildAppCss)));
  gulp.watch(configs.vendorLess, runTasks('buildVendorStyles', reload(configs.buildVendorCss)));
  gulp.watch(appFiles.html, runTasks('buildIndexHtml', reload(indexHtmlPath)));
  gulp.watch(appFiles.root, runTasks('buildRootFiles'));
  gulp.watch(appFiles.jsunit, ['testAppScripts']);
  gulp.watch(appFiles.jsx, function(e) {
    logChanged(e);

    if (e.type === 'deleted') {
      var delFile = path.relative('src', e.path);
      clean(path.join(configs.buildTmpSrc, delFile));
      if (path.extname(delFile) === '.jsx') {
        var delJs = delFile.slice(0, delFile.length-4) + '.js';
        clean(path.join(configs.buildTmpSrc, delJs));
        clean(path.join(configs.buildSrc, delJs), function() {
          runSequence('buildIndexHtml', reload(indexHtmlPath));
        });
      }
      return;
    }

    if (e.type === 'changed') runSequence('buildAppScripts', reload(indexHtmlPath));
    else runSequence('buildAppScripts', 'buildIndexHtml', reload(indexHtmlPath));
  });
});
