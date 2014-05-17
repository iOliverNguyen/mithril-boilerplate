# mithril-seed

> Boilerplate code for mithril.js project

## Quick start

Make sure you have `node` and `npm` installed. Then

```
git clone https://github.com/ng-vu/mithril-seed.git
cd mithril-seed
npm install -g bower gulp http-server
npm install
bower install
git compile
http-server build/public
```

Running above commands compile source and put final code in these directories:

* `build` for development
* `bin` for production

You may run the application by either of these commands:

* `http-server build/public`
* `http-server bin/public`

## Commands

### `gulp clean`

### `gulp build`

### `gulp compile`

### Running a specific task

These tasks describe specific steps in building process:

* `gulp buildAppStyles`
* `gulp buildVendorStyles`
* `gulp compileStyles`
* `gulp buildAppScriptsInject`
* `gulp buildAppScriptsMsx`
* `gulp buildAppScriptPlain`
* `gulp buildAppScripts`
* `gulp buildVendorScripts`
* `gulp compileScripts`
* `gulp buildAppAssets`
* `gulp buildVendorAssets`
* `gulp compileAssets`
* `gulp buildIndexHtml`
* `gulp compileIndexHtml`
* `gulp buildRootFiles`
* `gulp compileRootFiles`

## Watch, live reload and test

I will support these tasks in next release.

## Note

* Source files must be `.jsx`, not `.js`.

* Each `.jsx` file inside `src/app` without `_` prefix will become a module.

  For example, `src/app/app.jsx` is compiled to module `app` and `src/app/home/home.jsx` to `home/home`.

  Files with `_` prefix are used to inject into other files and will not become a module.

* A module can be required by `require(<module-id>)`.

  For example, `require('app')` or `require('home/home')`.

* Main module is `main` (`src/app/main.jsx`).

  Note that if a module is not required (directly or indirectly) by `main`, its code will not run.

* Include file by `INJECT('<file-id>')`.

  For example `INJECT('home/view')` will replace the INJECT call with whole content of `src/app/home/_home.view.jsx`. Note that `home/_home.view.jsx` will be translate to `home/home.view`.
