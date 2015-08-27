'use strict';

var esprima = require('esprima');
var estraverse = require('estraverse');
var _ = require('lodash');
var vfs = require('vinyl-fs');
var glob = require('glob-to-vinyl');
var mapS = require('map-stream');

function parseOptions(opts) {
  var defaultOpts = {
    // default options
  };
  return _.merge(defaultOpts, (opts || {}));
}

function findDependencies(source, opts) {
  opts = parseOptions(opts);

  var mapService = {};

  estraverse.traverse(esprima.parse(source), {
    leave: function(node, parent) {

      if(isService(node)) {
        buildTree(parent, mapService);
      }

    }
  });

  return mapService;
}

function buildTree(node, map) {

  if(node.type === 'CallExpression') {

    var name  = ((node.callee || {}).property || {}).name;
    var service  = ((node.arguments || [])[0] || {}).value;


    if(service) {
      map[service] = {
        name: service,
        type: name,
        checksum: ''
      };

    var args = [];

    args = _.map(
        _.flatten(node
          .arguments
          .map(function (item) {
            return item.params;
          })
          .filter(Boolean), true),
        function (item) {
          return {
            name: item.name,
            checksum: ''
          };
        });

      map[service].dependencies = (args || [])
        .filter(function (dep) {
          return dep.name.charAt(0) !== '$';
        });
    }
  }

}

var path = require('path');
var crypto = require('crypto');
function checksum(str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'sha1')
        .update(str, 'utf8')
        .digest(encoding || 'hex');
}

function bindCheckSum(config, cb) {
  glob('./src/js/**/**/*.js', function (err, files) {

    if(err) {
      throw err;
    }

    var name;
    files
      .forEach(function (file) {
        name = path.basename(file.relative, '.js');
        if('index' !== name) {
          (config[name] || {}).checksum = checksum(file.contents.toString());
          (config[name] || {}).updateAt = file.stat.ctime;
        }
      });

    cb(attachCheckSumPerDependency(config));
  });
}

function attachCheckSumPerDependency(data) {

  Object
    .keys(data)
    .forEach(function (service) {

      data[service].dependencies = data[service]
        .dependencies
        .map(function (req) {

          if(req.name) {
            req.checksum = (data[req.name] || {}).checksum;
            req.updateAt = (data[req.name] || {}).updateAt;
          }
          return req;
        });

    });

  return data;
}

function findRecentFiles(deps) {
  return Object
    .keys(deps)
    .filter(function (file) {
      // Files update last days
      return deps[file].updateAt >= new Date(Date.now()-3600*24*1000);
    });
}

function isService(node) {
  return node.type === 'MemberExpression' && /factory|service|provider|filter|directive|config|value|run/.test(node.property.name);
}

function isAngularModuleStatement(node) {
  return node.type === 'MemberExpression' && node.object.name === 'angular' && node.property.name === 'module';
}

function isNgModuleDeclaration(node) {
  return node.type === 'CallExpression' && node.callee.name === 'angularModule' && node.arguments.length > 0 && node.arguments[0].value === 'ng';
}

module.exports = {
  load: findDependencies,
  checksum: bindCheckSum,
  findRecentFiles: findRecentFiles
};
module.exports.isAngularModuleStatement = isAngularModuleStatement;
module.exports.isNgModuleDeclaration = isNgModuleDeclaration;
