var chalk = require('chalk');

function success(prefix, message)
{
	console.log(chalk.yellow(prefix) + ': ' + message);
}

function failure(prefix, message)
{
	console.log(chalk.yellow(prefix) + ': ' + chalk.red('ERROR'));
	console.log(message);
}

module.exports = {
	success: success,
	failure: failure
};
