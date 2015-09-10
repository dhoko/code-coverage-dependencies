'use strict';

function lastUpdatedFiles(deps) {
  return Object
    .keys(deps)
    .filter(function (file) {
      // Files update last days
      return deps[file].updateAt >= new Date(Date.now()-3600*24*1000);
    });
}

function lastUpdated(data) {

  var list = [];
  var updated = lastUpdatedFiles(data);

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

  return list;
}

module.exports = {
  lastUpdated: lastUpdated,
  lastUpdatedFiles: lastUpdatedFiles
};
