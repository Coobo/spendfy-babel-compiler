let cooboCompiler = require('./../');
let path = require('path');

cooboCompiler.compiler({
  filenames: [path.resolve(__dirname, './src')],
  outDir: path.resolve(__dirname, './dist'),
  basePath: path.resolve(__dirname, './../')
  //verbose: true
});
