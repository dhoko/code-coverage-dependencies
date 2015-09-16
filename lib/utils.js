'use strict';

/**
 * Find lates updated files from a Map
 * @param  {Object} deps
 * @return {Array}
 */
function lastUpdatedFiles(deps) {

  return Object
    .keys(deps)
    .reduce(function (accus, file) {
      // Files update last days
      if(deps[file].updateAt >= new Date(Date.now()-3600*24*1000)) {
        accus.push(deps[file]);
      }
      return accus;
    }, []);
}

/**
 * Find latest updated dependencies and list each dependencies
 * using one of the updated
 * @param  {Object} data
 * @return {Array}
 */
function lastUpdatedFileWhereDependencyExist(data) {

  var tmp = {};
  var names = lastUpdatedFiles(data)
    .map(function (dep) {
      return dep.name;
    });

  var files = Object
    .keys(data)
    .filter(function (dep) {
      tmp = data[dep];
      return (tmp.dependencies || [])
        .some(function (subDep) {
          return names.indexOf(subDep.name) !== -1;
        });
    });

  return {
    dependencies: names,
    files: files
  };
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
  lastUpdatedFiles: lastUpdatedFiles,
  filesToUpdate: lastUpdatedFileWhereDependencyExist
};
