var util = require('./../util/index');
var { sync: mkdirpSync } = require('mkdirp');
var { handle } = require('./functions');

/**
 * Function responsible for compiling files into nodejs current ECMASCRIPT
 * @param {Object} options
 * @param {Object} options.compilerOptions
 * @param {String[]} options.compilerOptions.filenames
 * @param {String} options.compilerOptions.outDir
 * @param {Boolean} [options.compilerOptions.relative=false]
 * @param {Boolean} [options.compilerOptions.watch=false]
 * @param {Boolean} [options.compilerOptions.verbose=false]
 * @param {Boolean} [options.compilerOptions.copyFiles=false]
 * @param {Boolean} [options.compilerOptions.includeDotfiles=false]
 * @param {Boolean} [options.compilerOptions.skipInitialBuild=false]
 * @param {Boolean} [options.compilerOptions.deleteDirOnStart=false]
 * @param {Object} options.babelOptions
 */
module.exports = async function(options) {
  if (!options.basePath)
    throw new Error('Você não proveu a opção basePath para as opções.');

  let { compilerOptions, babelOptions } = util.options.defaults({
    compilerOptions: { ...options },
    babelOptions: util.options.parsePackageJson(options.basePath)
  });

  if (compilerOptions.verbose)
    console.log(
      util.colorize.info(
        `@coobo/compiler ${
          require('./../../package.json').version
        } is starting to compile your code...`
      ),
      '\n'
    );
  // const filenames = compilerOptions.filenames;

  if (!compilerOptions.skipInitialBuild) {
    if (compilerOptions.deleteDirOnStart) {
      util.deleteDir(compilerOptions.outDir);
    }

    mkdirpSync(compilerOptions.outDir);

    let compiledFiles = 0;
    for (const filename of compilerOptions.filenames) {
      compiledFiles += await handle(filename, compilerOptions, babelOptions);
    }

    console.log('\n');

    console.log(
      `Successfully compiled ${compiledFiles} ${
        compiledFiles !== 1 ? 'files' : 'file'
      } with @coobo/compiler.`
    );
  }
};
