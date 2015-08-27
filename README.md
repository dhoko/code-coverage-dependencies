# Code Coverage Dependencies
Check if your code is up to date with your dependencies

```js
#!/usr/bin/env node

'use strict';

var fs = require('fs');
var ngDeps = require('ng-dependencies');

var deps = ngDeps.load(fs.readFileSync('./app/js/app.js'));


ngDeps
  .checksum(deps, function (data) {
    // console.log(JSON.stringify(data, null, 2));


    var updated = ngDeps.findRecentFiles(data);

    var list = [];

    updated
      .forEach(function (componentName) {
        Object
          .keys(data)
          .forEach(function (component) {
            var contains = data[component]
              .dependencies
              .some(function (dep) {
                return dep.name === componentName;
              });

            if(contains) {
              list.push(data[component]);
            }
          });
      });

      console.log(JSON.stringify(list, null, 2));

  });

```
