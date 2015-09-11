'use strict';

var glob = require('glob-to-vinyl'),
    Promise = require('bluebird');

var cache;

/**
 * File iterator
 * @param  {String}   src Glob
 * @param  {Function} cb  callback on success and return Buffer
 */
function iterate(src, cb) {

  if(cache) {
    return cb(cache);
  }

  glob(src, function (err, files) {

    if(err) {
      throw err;
    }

    cache = {
      buffer: files.map(function (file) {
        return file.contents;
      }),
      files: files
    };

    cache.buffer = Buffer.concat(cache.buffer);

    cb(cache);
  });
}

/**
 * Fetch the source and return a buffer of it
 * @param  {String|Buffer}
 * @return {Promise}
 */
function bufferSrc(src) {

  return new Promise(function (resolve, reject) {

    try{
      if(!Buffer.isBuffer(src)) {
        iterate(src, function (data) {
          resolve(data.buffer);
        });
      }else {
        resolve(src);
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
