var fs = require('fs');
var path = require('path');
var util = require('./../../util/');
var handleFile = require('./handleFile');

module.exports = async function handle(
  filenameOrDir,
  compilerOptions,
  babelOptions
) {
  if (!fs.existsSync(filenameOrDir)) return 0;

  const stat = fs.statSync(filenameOrDir);

  if (stat.isDirectory()) {
    const dirname = filenameOrDir;

    let count = 0;

    const files = util.readdir(dirname, compilerOptions.includeDotfiles);
    for (const filename of files) {
      const src = path.join(dirname, filename);

      const written = await handleFile(
        src,
        dirname,
        compilerOptions,
        babelOptions
      );
      if (written) count += 1;
    }

    return count;
  } else {
    const filename = filenameOrDir;
    const written = await handleFile(
      filename,
      path.dirname(filename),
      compilerOptions,
      babelOptions
    );

    return written ? 1 : 0;
  }
};
