var fs = require('fs');
var path = require('path');
var write = require('./write');
var outputFileSync = require('output-file-sync');
var getDest = require('./getDest');
var util = require('./../../util/');

module.exports = async function handleFile(
  src,
  base,
  compilerOptions,
  babelOptions
) {
  const written = await write(src, base, compilerOptions, babelOptions);

  if (!written && compilerOptions.copyFiles) {
    const filename = path.relative(base, src);
    const dest = getDest(filename, base, compilerOptions);
    outputFileSync(dest, fs.readFileSync(src));
    util.chmod(src, dest);
  }
  return written;
};
