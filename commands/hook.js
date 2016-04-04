var
	chalk    = require('chalk'),
	Registry = require('../lib/registry'),
	report   = require('../lib/report')
	;

function hooks(argv)
{
	// TODO: should just respond with help, I think, or docs
}

hooks.add = function add(argv)
{
	// TODO
	report.success('hook add', 'hooking ' + chalk.yellow(argv.pkg) +
		' to ' + chalk.yellow(argv.url) +
		' with shared secret ' + chalk.red(argv.secret)
	);
};

hooks.rm = function rm(argv)
{
	report.success('hook rm', 'un-hooking ' + chalk.yellow(argv.pkg) +
		' from ' + chalk.yellow(argv.url)
	);
};

hooks.ls = function ls(argv)
{
	// TODO
};

hooks.test = function test(argv)
{
	// TODO
	report.success('hook test', 'testing hook on ' + chalk.yellow(argv.pkg) +
		' to ' + chalk.yellow(argv.url)
	);
};

function noop() {}

function builder(yargs)
{
	return yargs
		.reset()
		.command('add <pkg> <url> <secret>', 'add a webhook', noop, hooks.add)
		.command('rm <pkg> <url>', 'remove a webhook', noop, hooks.rm)
		.command('ls [pkg]', 'list webhooks', noop, hooks.ls)
		.command('test <pkg> <url>', 'test a webhook', noop, hooks.test)
	;
}

module.exports = {
	command: 'hook',
	describe: 'control your webhooks',
	builder: builder,
	handler: hooks
};
