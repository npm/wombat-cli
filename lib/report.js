var
	chalk = require('chalk'),
	util = require('util');

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

function json(obj)
{
	console.log(util.inspect(obj, { colors: true }));
}

module.exports = {
	success: success,
	failure: failure,
	json: json
};
