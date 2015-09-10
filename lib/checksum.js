'use strict';

var path   = require('path'),
    crypto = require('crypto'),
    cfg    = require('./config'),
    glob   = require('glob-to-vinyl');

function checksum(str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'sha1')
    .update(str, 'utf8')
    .digest(encoding || 'hex');
}

function bindCheckSum(config, cb) {

  glob(cfg.src, function (err, files) {

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

module.exports = bindCheckSum;
