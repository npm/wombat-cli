var chalk = require('chalk');

function success(prefix, message)
{
	message = message || '';
	if (prefix)
		message = chalk.yellow(prefix) + ' ' + message;
	console.log(message);
}

function failure(prefix, message)
{
	message = chalk.red('ERROR') + ': ' + message;
	if (prefix)
		message = chalk.yellow(prefix) + ' ' + message;
	console.log(message);
}

module.exports = {
	success: success,
	failure: failure
};
