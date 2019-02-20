var path = require('path');

module.exports = function getDest(filename, base, compilerOptions) {
  if (compilerOptions.relative) {
    return path.join(base, compilerOptions.outDir, filename);
  }
  return path.join(compilerOptions.outDir, filename);
};
