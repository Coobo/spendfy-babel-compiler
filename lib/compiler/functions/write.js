var path = require('path');
var outputFileSync = require('output-file-sync');
var slash = require('slash');
var util = require('./../../util/');
var getDest = require('./getDest');

module.exports = async function write(
  src,
  base,
  compilerOptions,
  babelOptions
) {
  let relative = path.relative(base, src);

  relative = util.adjustRelative(relative, base);

  const dest = getDest(relative, base, compilerOptions);

  try {
    const res = await util.compile(
      src,
      Object.assign(
        {},
        { sourceFileName: slash(path.relative(dest + '/..', src)) },
        babelOptions
      )
    );

    if (!res) return false;

    // Explicit sourcemaps writting to disk
    if (
      res.map &&
      babelOptions.sourceMaps &&
      babelOptions.sourceMaps !== 'inline'
    ) {
      const mapLoc = dest + '.map';
      res.code = util.addSourceMappingUrl(res.code, mapLoc);
      res.map.file = path.basename(relative);
      outputFileSync(mapLoc, JSON.stringify(res.map));
    }

    outputFileSync(dest, res.code);
    util.chmod(src, dest);

    if (compilerOptions.verbose) {
      console.log(
        util.colorize.warn(src) +
          util.colorize.info(' -> ') +
          util.colorize.success(dest)
      );
    }

    return true;
  } catch (err) {
    if (compilerOptions.watch) {
      console.error(err);
      return false;
    }

    throw err;
  }
};
