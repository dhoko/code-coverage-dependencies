# codeCoverageDependencies
Check if your code is up to date with your dependencies

```js
var fs = require('fs');
var ngDeps = require('ng-dependencies');

var deps = ngDeps.load(fs.readFileSync('./app/js/app.js'));


console.log(JSON.stringify(deps, null, 2));
var bindCheck = ngDeps.checksum(deps);

setTimeout(function() {
  console.log(JSON.stringify(deps, null, 2));
}, 1000);
```
