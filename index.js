'use strict';

var esprima = require('esprima');
var estraverse = require('estraverse');
var _ = require('lodash');

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

      map[service].dependencies = args;
    }
  }

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

module.exports = findDependencies;
module.exports.isAngularModuleStatement = isAngularModuleStatement;
module.exports.isNgModuleDeclaration = isNgModuleDeclaration;

