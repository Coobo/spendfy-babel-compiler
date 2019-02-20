const utils = exports;

utils.options = require('./options');
utils.colorize = require('./colorize');

var readDirRecursive = require('fs-readdir-recursive');
var babel = require('@babel/core');
var path = require('path');
var fs = require('fs');

var util = exports;

util.chmod = (src, dest) => fs.chmodSync(dest, fs.statSync(src).mode);

util.readdir = (dirname, includeDotfiles, filter) =>
  readDirRecursive(dirname, (filename, _index, currentDirectory) => {
    const stat = fs.statSync(path.join(currentDirectory, filename));

    if (stat.isDirectory()) return true;

    return (
      (includeDotfiles || filename[0] !== '.') && (!filter || filter(filename))
    );
  });

util.addSourceMappingUrl = (code, loc) =>
  `${code}\n//# sourceMappingURL=${path.basename(loc)}`;

util.transform = (filename, code, opts) => {
  opts = {
    ...opts,
    caller: {
      name: (opts.caller && opts.caller.name) || '@coobo/compiler',
      filename
    }
  };

  return new Promise((resolve, reject) => {
    babel.transform(code, opts, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

util.compile = (filename, opts) => {
  opts = { ...opts, filename };

  return new Promise((resolve, reject) => {
    babel.transformFile(filename, opts, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

util.deleteDir = (path) => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file) => {
      const curPath = path + '/' + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        util.deleteDir(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

process.on('uncaughtException', function(err) {
  console.error(err);
  process.exit(1);
});

util.adjustRelative = (relative, keepFileExtension) => {
  if (keepFileExtension) {
    return relative;
  }
  return relative.replace(/\.(\w*?)$/, '') + '.js';
};
