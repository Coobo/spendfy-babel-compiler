var chalk = require('chalk');
const colorize = exports;
/**
 * Colorizes a string with warn color.
 */
colorize.warn = (msg) => chalk.yellow(msg);

/**
 * Colorizes a string with success color.
 */
colorize.success = (msg) => chalk.green(msg);

/**
 * Colorizes a string with info color.
 */
colorize.info = (msg) => chalk.cyan(msg);

/**
 * Colorizes a string with error color.
 */
colorize.error = (msg) => chalk.red(msg);
