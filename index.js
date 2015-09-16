'use strict';

var tree      = require('./lib/tree'),
    fileUtils = require('./lib/fileUtils'),
    checksum  = require('./lib/checksum'),
    cUtils    = require('./lib/utils'),
    Promise   = require('bluebird');

function CodeDependencies(cfg) {
  this.src = cfg.src;
  this.deps = {};

  if(!this.src) {
    throw new Error('You must specify a source. src can be a glob or a buffer');
  }
}


/**
 * Parse the source and build a map
 * Resolve a tree of depenencies and return the last updated
 * components with their dependencies
 * @return {Promise} {latest: <Array>, tree: <Object>}
 */
CodeDependencies.prototype.get = function() {

  var self = this;

  return new Promise(function (resolve, reject) {
    fileUtils
      .buffer(self.src)
      .then(function (src) {
        self.deps = tree(src);

        checksum(self.src, self.deps, function (data) {
          resolve({
            tree: data,
            latest: cUtils.lastUpdatedFiles(data),
            files: cUtils.filesToUpdate(data)
          });
        });

      })
      .catch(reject);
  });

};

module.exports = {
  load: function(opt) {
    return new CodeDependencies(opt);
  }
};
