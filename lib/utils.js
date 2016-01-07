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

  var names = lastUpdatedFiles(data)
    .map(function (dep) {
      return {
        name: dep.name,
        path: dep.path
      };
    });

  var nameList = names.map(function(item) {
    return item.name;
  });

  var files = Object
    .keys(data)
    .filter(function (dep) {
      return (data[dep].dependencies || [])
        .some(function (subDep) {
          return nameList.indexOf(subDep.name) !== -1;
        });
    })
    .map(function (dep) {
      return {
        name: dep,
        path: data[dep].path
      }
    })

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
