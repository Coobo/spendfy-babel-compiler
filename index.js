const cooboCompiler = exports;

var compiler = require('./lib/compiler');

cooboCompiler.version = require('./package.json').version;

cooboCompiler.compiler = compiler;
