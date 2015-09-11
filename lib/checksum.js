'use strict';

var path      = require('path'),
    crypto    = require('crypto'),
    fileUtils = require('./fileUtils');


function checksum(str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'sha1')
    .update(str, 'utf8')
    .digest(encoding || 'hex');
}

function bindCheckSum(from, config, cb) {

  fileUtils.iterate(from, function (data) {

    var name;
    data.files
      .forEach(function (file) {
        name = path.basename(file.relative, '.js');
        if('index' !== name) {
          (config[name] || {}).checksum = checksum(file.contents.toString());
          (config[name] || {}).updateAt = file.stat.mtime;
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

module.exports = bindCheckSum;
