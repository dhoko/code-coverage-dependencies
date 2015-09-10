'use strict';

var glob = require('glob-to-vinyl'),
    Promise = require('bluebird');

var cache;

function iterate(src, cb) {

  if(cache) {
    return cb(cache);
  }

  glob(src, function (err, files) {

    if(err) {
      throw err;
    }

    cache = files;

    cb(files);
  });
}

function bufferSrc(config) {
  return new Promise(function (resolve, reject) {

    try{
      if(!config.bufferSrc) {
        iterate(config.src, function (data) {

          var filesBuffer = data.map(function (file) {
            return file.contents;
          });

          var bufferApp = Buffer.concat(filesBuffer);
          resolve(bufferApp);
        });
      }else {
        resolve(config.bufferSrc);
      }


    }catch (e){
      reject(e);
    }

  });
}

module.exports = {
  iterate: iterate,
  buffer: bufferSrc
};
