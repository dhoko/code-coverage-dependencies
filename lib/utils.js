'use strict';

function findRecentFiles(deps) {
  return Object
    .keys(deps)
    .filter(function (file) {
      // Files update last days
      return deps[file].updateAt >= new Date(Date.now()-3600*24*1000);
    });
}

module.exports = {
  findRecentFiles: findRecentFiles
};