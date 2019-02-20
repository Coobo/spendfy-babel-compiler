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
  let start = new Date();
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
        util.colorize.warn(trimPath(base, src)) +
          util.colorize.info(' -> ') +
          util.colorize.success(trimPath(base, dest)) +
          util.colorize.error(' +' + (new Date() - start) + 'ms')
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

function trimPath(basePath, src) {
  basePath = path.normalize(path.resolve(basePath));
  basePath =
    basePath.indexOf('/') > -1 ? basePath.split('/') : basePath.split('\\');

  src = path.normalize(path.resolve(src));
  src = src.indexOf('/') > -1 ? src.split('/') : src.split('\\');

  src = src.filter((semiPath, index) => index >= basePath.length - 1);
  return path.normalize(src.join('/'));
}
