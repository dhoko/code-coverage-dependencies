# codeCoverageDependencies
Check if your code is up to date with your dependencies

```js
#!/usr/bin/env node

'use strict';

var fs = require('fs');
var ngDeps = require('ng-dependencies');

var deps = ngDeps.load(fs.readFileSync('./app/js/app.js'));


console.log(JSON.stringify(deps, null, 2));
ngDeps
  .checksum(deps, function(data) {
    console.log(JSON.stringify(data, null, 2));
  });

```
