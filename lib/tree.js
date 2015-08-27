'use strict';

var _ = require('lodash'),
    esprima = require('esprima'),
    estraverse = require('estraverse');

function parseOptions(opts) {
  var defaultOpts = {
    // default options
  };
  return _.merge(defaultOpts, (opts || {}));
}

function findDependencies(source, opts) {

  opts = parseOptions(opts);

  var mapService = {};

  estraverse
    .traverse(esprima.parse(source), {
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

function isService(node) {
  return node.type === 'MemberExpression' && /factory|service|provider|filter|directive|config|value|run/.test(node.property.name);
}

module.exports = findDependencies;