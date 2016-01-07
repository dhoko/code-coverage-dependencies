# Code Coverage Dependencies
Check if your code is up to date with your dependencies

## API

### load(<object:config>)

- src: a glob string or a buffer

It creates a new instance for a report.

#### Api instance

##### `get()`

It returns a promise.
Promise success args: `{tree: <Object>, latest: <Array>}`

- tree is the dependency tree for your app
- latest is an array of last updated depenencies (<= 1 day)
- files an object with two keys:
  - dependencies: <Array> list of names for the last updated dependencies
  - files: <Array> list of dependencies names depending on these latest updated dependencies (key dependencies)

## Demo

```js
#!/usr/bin/env node

'use strict';

var fs = require('fs');
var dependencies = require('code-coverage-dependencies');


var deps = dependencies
  .load({
    src: './src/js/**/**/*.js',
    // src: fs.readFileSync('./app/js/app.js')
  })
  .get()
  .then(function (data) {
    console.log(JSON.stringify(data.tree, null, 2));
    console.log(JSON.stringify(data.latest, null, 2));
    console.log(JSON.stringify(data.files, null, 2));
    return data.files.toUpdate;
  })
  .then(ngDeps.render);

```

1. Set a glob or a buffer for the source input
2. Fetch informations for dependencies
3. Display some informations about them
  - The full dependencies tree
  - Latest updated dependencies object tree
  - Latest updated dependencies name and the list of depending ones