var
	chalk    = require('chalk'),
	Registry = require('../lib/registry'),
	report   = require('../lib/report')
	;

function hooks(argv)
{
	// set this here and it's set for all the subcommands
	argv._handled = true;
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
	report.success('hook rm', 'un-hooking ' + chalk.yellow(argv.id));
};

hooks.ls = function ls(argv)
{
	var uri = 'v1/hooks/hook';
	if (argv.pkg)
		uri += '/' + encodeURIComponent(argv.pkg);

	Registry.authed('GET', uri, function(err, res, body)
	{
		if (err)
			return report.failure('hook ls', err.message);
		if (!body || res.statusCode < 200 || res.statusCode >= 400)
			return report.failure('hook ls', res.statusCode + ' ' + JSON.stringify(body));

		// TODO format the response
	});
};

hooks.test = function test(argv)
{
	// TODO
	report.success('hook test', 'testing hook id ' + chalk.yellow(argv.id));
};

function noop() {}

function builder(yargs)
{
	return yargs
		.command('ls [pkg]', 'list your hooks', noop, hooks.ls)
		.command('add <pkg> <url> <secret>', 'add a hook to the named package', noop, hooks.add)
		.command('update <id> <url> [secret]', 'update an existing hook', noop, hooks.add)
		.command('rm <id>', 'remove a hook', noop, hooks.rm)
		.command('test <id>', 'test a hook', noop, hooks.test)
		.example('$0 hook add lodash https://example.com/ my-shared-secret')
		.example('$0 hook ls lodash')
		.example('$0 hook rm id-ers83f')
	;
}

module.exports = {
	command: 'hook',
	describe: 'control your hooks',
	builder: builder,
	handler: hooks
};
