'use strict';

var tree     = require('./lib/tree'),
    utils    = require('./lib/utils'),
    checksum = require('./lib/checksum');

function CodeDependencies(opt) {
  this.opt = opt;
  this.deps = {};
}

CodeDependencies.prototype.src = function(srcFiles) {
  this.deps = tree(srcFiles, this.opt);
  return this;
};

CodeDependencies.prototype.get = function(cb) {
  return checksum(this.deps, cb || function() {});
};



module.exports = {
  load: function(srcFiles, opt) {
    return new CodeDependencies(opt).src(srcFiles);
  },
  findRecentFiles: utils.findRecentFiles
};
