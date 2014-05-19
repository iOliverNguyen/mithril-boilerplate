// User configs

var path = require('path');

var configs = {
  buildAppCss: 'app.css',
  buildAppJs: 'app.js',
  buildVendorCss: 'vendor.css',
  buildVendorJs: 'vendor.js',

  buildAssets: 'build/public/assets/',
  buildAssetsVendor: 'build/public/assets/vendor/',
  buildHtml: 'build/public/',
  buildPublic: 'build/public/',
  buildSrc: 'build/public/src/',
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

  mainScripts: ['app/main.js']
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
  livereload_port: 35729,
};

var modes = [consts.development, consts.production];

/* -------------------------------------------------------------------------- */
// Implement tasks

var gulp = require('gulp');
var includejs = require('./res/includejs');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var wrapRequire = require('./res/wrap-require');

var colors = plugins.util.colors;
var log = plugins.util.log;

function clean(filePath, cb) {
  log('Clean ' + colors.blue(filePath));
  gulp.src(filePath, {read: false})
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

function buildStyles(src, options, cb) {
  gulp.src(src)
    .pipe(plugins.less(options))
    .pipe(plugins.size({showFiles: true}))
    .pipe(gulp.dest(configs.buildAssets))
    .on('end', cb || function(){})
    .on('error', log);
}

// Generate build/public/assets/app-***.css
gulp.task('buildAppStyles',function(cb) {
  buildStyles(configs.appLess, {sourceMap:true}, cb);
});

// Generate build/public/assets/vendor-***.css
gulp.task('buildVendorStyles', function(cb) {
  buildStyles(configs.vendorLess, {sourceMap:false}, cb);
});

// Generate bin/public/assets/main-***.css
gulp.task('compileStyles', function(cb) {
  clean(path.join(configs.compileAssets, revName(configs.compileMainCss)), _compileStyles);

  function _compileStyles() {
    gulp.src([
      path.join(configs.buildAssets, configs.buildVendorCss),
      path.join(configs.buildAssets, configs.buildAppCss),
    ])
      .pipe(plugins.concat(configs.compileMainCss))
      .pipe(plugins.minifyCss())
      .pipe(plugins.streamify(plugins.rev()))
      .pipe(plugins.size({showFiles: true}))
      .pipe(gulp.dest(configs.compileAssets))
      .on('end', cb || function(){})
      .on('error', log);
  }
});

// Combine *.jsx to build/src/app
gulp.task('buildAppScriptsInject', function(cb) {
  gulp.src(appFiles.jsx, {base: 'src/app'})
    .pipe(includejs())
    .pipe(plugins.size({showFiles: true}))
    .pipe(gulp.dest(path.join(configs.buildSrc, 'app')))
    .on('end', cb || function(){})
    .on('error', log);
});

// Convert app scripts from .jsx to .js and wrap them in require style
gulp.task('buildAppScriptsMsx', function(cb) {
  var appPath = path.join(configs.buildSrc, 'app');
  gulp.src(appPath + '/**/*.jsx', {base: appPath})
    .pipe(plugins.msx())
    // .pipe(plugins.sweetjs({modules: ['./res/template-compiler.sjs']}))
    .pipe(wrapRequire(appPath))
    .pipe(plugins.size({showFiles: true}))
    .pipe(gulp.dest(appPath))
    .on('end', cb || function(){})
    .on('error', log);
});

gulp.task('buildAppScriptPlain', function(cb) {
  gulp.src(appFiles.js, {base: 'src'})
    .pipe(plugins.size({showFiles: true}))
    .pipe(gulp.dest(configs.buildSrc))
    .on('end', cb || function(){})
    .on('error', log);
});

// Combine and convert *.jsx
// Copy *.js to build/src/app/
gulp.task('buildAppScripts', function(cb) {
  runSequence('buildAppScriptsInject', 'buildAppScriptsMsx', 'buildAppScriptPlain', cb);
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
      [path.join(configs.buildSrc, 'app/**/*.js')]
    );
    gulp.src(glob)
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
    .pipe(injectHtml('vendor', configs.buildPublic,
      [
        path.join(configs.buildAssets, configs.buildVendorCss),
        path.join(configs.buildVendor, '**/*.js')
      ]
    ))
    .pipe(injectHtml('app', configs.buildPublic,
      [
        path.join(configs.buildAssets, configs.buildAppCss),
        path.join(configs.buildSrc, 'app/**/*.js')
      ]
    ))
    .pipe(plugins.insert.append('<script>require(\'main\');</script>'))
    .pipe(plugins.size({showFiles:true}))
    .pipe(gulp.dest(configs.buildHtml))
    .on('end', cb || function(){})
    .on('error', log);
});

gulp.task('compileIndexHtml', function(cb) {
  gulp.src(appFiles.html)
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
  // build dependence tree
  // pass through changed files ()
  // remember import files
  // second run: only process changed file
  // options: catch: false

  gulp.watch('src/app/**/*.jsx')
    .pipe(plugins.includejs())
    .pipe();
});

// Tasks to run whenever a test file changes
gulp.task('watchtest', function() {

});

// Any file added or removed: indexHtml
// root: copy, cache
// jsx: includejs, wrap require...
// assets: copy, cache
// scss: app.css
// vendor.scss: vendor
