# Code Coverage Dependencies
Check if your code is up to date with your dependencies

```js
#!/usr/bin/env node

'use strict';

var fs = require('fs');
var ngDeps = require('code-coverage-dependencies');


var deps = ngDeps
  .load({
    src: './src/js/**/**/*.js',
    // src: fs.readFileSync('./app/js/app.js')
  })
  .get()
  .then(function (data) {
    console.log(JSON.stringify(data.tree, null, 2));
    console.log(JSON.stringify(data.latest, null, 2));
  });

```

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
