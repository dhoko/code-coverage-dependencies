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

function findComponentPerDependency(data, key) {

  return Object
    .keys(data)
    .filter(function (name) {
      var dep = data[name].dependencies || [];
      return dep.some(function (d) {
        return key === d.name;
      });
    })
    .map(function (name) {
      return {
        name: data[name].name,
        path: data[name].path
      }
    });
}

function findDependenciesToUpdate(names, data) {
  return names
    .reduce(function (acc, name) {
      acc[name] = findComponentPerDependency(data, name);
      return acc;
    }, {})
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
      return dep.name;
    });

  var files = findDependenciesToUpdate(names, data);

  return {
    toUpdate: files,
    updated: names,
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
