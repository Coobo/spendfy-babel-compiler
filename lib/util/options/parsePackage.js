var path = require('path');
var fs = require('fs');
var colorize = require('./../colorize.js');
var debug = require('debug')('@coobo/compiler:util:options:parsePackage');

module.exports = function parsePackageJson(basePath) {
  debug(`function called. Args: basePath -> ${basePath}`);
  basePath = path.normalize(basePath);
  debug(`normalized basePath -> ${basePath}`);
  if (fs.existsSync(basePath)) {
    const stat = fs.statSync(basePath);
    let filePath;

    if (stat.isDirectory()) filePath = path.resolve(basePath, 'package.json');
    else
      filePath = path.resolve(
        basePath.substring(
          0,
          basePath.lastIndexOf('/') || basePath.lastIndexOf('\\')
        ),
        'package.json'
      );

    debug(`filePath -> ${filePath}`);
    let packageJson;
    try {
      packageJson = require(filePath);
    } catch (e) {
      console.log(
        colorize.error('Could not require package.json at path ' + filePath)
      );
      throw e;
    }

    debug('package.json successfully required');
    if (packageJson.spendfy && packageJson.spendfy.compiler) {
      return packageJson.spendfy.compiler;
    } else {
      throw new Error(
        'Your package.json file does not have the spendy compiler options available.'
      );
    }
  }
};
