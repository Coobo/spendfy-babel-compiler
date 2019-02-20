var colorize = require('./../colorize');
var debug = require('debug')('@coobo/compiler:util:options:defaults');

module.exports = function({ compilerOptions, babelOptions }) {
  const required = {
    compilerOptions: ['filenames', 'outDir', 'basePath'],
    babelOptions: ['presets']
  };
  debug(
    'Received options: compilerOptions -> %o | babelOptions -> %o',
    compilerOptions,
    babelOptions
  );

  debug('Checking required options...');
  for (let requiredOption of required.compilerOptions) {
    if (!compilerOptions[requiredOption]) {
      debug(
        'Required option %s not present in compilerOptions.',
        requiredOption
      );
      console.log(
        colorize.error(
          'Ocorreu um erro ao analisar as opções fornecidas ao compilador.'
        )
      );
      throw new Error(
        `Required option ${requiredOption} not present in compilerOptions.`
      );
    }
  }
  debug('All required options for compilerOptions found...');
  for (let requiredOption of required.babelOptions) {
    if (!babelOptions[requiredOption]) {
      debug('Required option %s not present in babelOptions.', requiredOption);
      console.log(
        colorize.error(
          'Ocorreu um erro ao analisar as opções fornecidas ao compilador.'
        )
      );
      throw new Error(
        `Required option ${requiredOption} not present in babelOptions.`
      );
    }
  }
  debug('All required options for babelOptions found...');

  return {
    compilerOptions: Object.assign(
      {},
      {
        deleteDirOnStart: true,
        verbose:
          process.env.BABEL_ENV === 'development' ||
          process.env.NODE_ENV === 'development',
        relative: false,
        copyFiles: false,
        includeDotFiles: false,
        skipInitialBuild: false
      },
      compilerOptions
    ),
    babelOptions: Object.assign(
      {},
      {
        caller: { name: '@coobo/compiler' },
        sourceMaps: 'inline',
        root: compilerOptions.basePath,
        envName:
          process.env.BABEL_ENV ||
          process.env.COOBO_ENV ||
          process.env.NODE_ENV ||
          'development',
        sourceType: 'module',
        highlightCode: true,
        minified:
          process.env.BABEL_ENV === 'production' ||
          process.env.NODE_ENV === 'production'
      },
      babelOptions
    )
  };
};
