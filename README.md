# mithril-boilerplate

> Boilerplate code for mithril.js project

## Quick start

Make sure you have `node` and `npm` installed. Then

```
npm install -g bower gulp http-server

git clone https://github.com/ng-vu/mithril-boilerplate.git
cd mithril-boilerplate

npm install
bower install
gulp compile

http-server build/public
```

Running above commands compile source and put final code in these directories:

* `build` for development
* `bin` for production

You may run the application by either of these commands:

* `http-server build/public`
* `http-server bin/public`

To automatically build project when a source file change:

```
gulp build watch
```

## Commands

### `gulp clean`

Clean all files in `build` and `bin` directory.

### `gulp build`

Build the project and put files in `build`.
You may run the application by:

```
gulp build
http-server build/public
```

### `gulp compile`

Build the project and put files in `bin`.
All stylesheets are concatenated to `app-***.css` and
all scripts are combined to `main-***.css` with `***` is content hash.
You may run the application by:
```
gulp compile
http-server bin/public
```

### `gulp watch`

Automatically build the project whenever a source file changes.
It caches source files and only runs tasks on changed files.
You should use `watch` together with `build`:
```
gulp build watch
```

### Running a specific task

These tasks describe specific steps in building process:

* `gulp buildAppStyles`
* `gulp buildVendorStyles`
* `gulp buildAppScriptsInject`
* `gulp buildAppScriptsMsx`
* `gulp buildAppScriptPlain`
* `gulp buildAppScripts`
* `gulp buildVendorScripts`
* `gulp buildAppAssets`
* `gulp buildVendorAssets`
* `gulp buildIndexHtml`
* `gulp compileIndexHtml`
* `gulp buildRootFiles`
* `gulp compileStyles`
* `gulp compileScripts`
* `gulp compileAssets`
* `gulp compileRootFiles`

## Watch, live reload and test

```
gulp build watch
```

## Note

* Source files must be `.jsx`, not `.js`.

  You should always write source in `.jsx` files. All `.js` files will be ignored by default.

  JSX is basically JavaScript enhanced with HTML tags. Mithril JSX compiler is based on React JSX. Read more: [Mithril Tools](http://lhorie.github.io/mithril/tools.html), [React JSX](http://facebook.github.io/react/docs/jsx-in-depth.html)

* Each `.jsx` file inside `src/app` without `_` prefix will become a module.

  For example, `src/app/app.jsx` is compiled to module `app` and `src/app/home/home.jsx` to `home/home`.

  Files with `_` prefix are used to be included into other files and will not become a module.

* A module can be required by `require(<module-id>)`.

  For example, `require('app')` or `require('home/home')`.

* Main module is `main` (`src/app/main.jsx`).

  Note that if a module is not required (directly or indirectly) by `main`, its code will not run.

* Include file by `INCLUDE('<file-id>')`.

  For example `INCLUDE('home/view')` will replace the INCLUDE call with whole content of `src/app/home/_home.view.jsx`. Note that `home/_home.view.jsx` will be translated to `home/home.view`.
