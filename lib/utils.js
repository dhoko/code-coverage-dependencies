'use strict';

/**
 * Find lates updated files from a Map
 * @param  {Object} deps
 * @return {Array}
 */
function lastUpdatedFiles(deps) {
  return Object
    .keys(deps)
    .filter(function (file) {
      // Files update last days
      return deps[file].updateAt >= new Date(Date.now()-3600*24*1000);
    });
}

/**
 * Build a collection of each last updated files and
 * map them with their dependencies
 * @param  {Object} data
 * @return {Array}
 */
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
