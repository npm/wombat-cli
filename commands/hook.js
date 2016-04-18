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
	// TODO match with service
	report.success('hook add', 'hooking ' + chalk.yellow(argv.pkg) +
		' to ' + chalk.yellow(argv.url) +
		' with shared secret ' + chalk.red(argv.secret)
	);

	var reg = new Registry(argv);
	var opts = {
		method: 'POST',
		uri: '/v1/hooks/hook/',
		json: {
			name:   argv.pkg,
			url:    argv.url,
			secret: argv.secret
		}
	};

	reg.authed(opts, function(err, res, hook)
	{
		if (err)
			return report.failure('hook add', err.message);
		if (!hook || res.statusCode < 200 || res.statusCode >= 400)
			return report.failure('hook add', res.statusCode + ' ' + JSON.stringify(hook));

		// TODO assumption here is that the body of the response is the updated hook
		report.success('+', hook.name + ' ➜ ' + hook.url);
	});
};

hooks.rm = function rm(argv)
{
	// TODO match with service
	report.success('hook rm', 'un-hooking ' + chalk.yellow(argv.id));
	var reg = new Registry(argv);
	var opts = {
		method: 'DEL',
		uri: '/v1/hooks/hook/' + encodeURIComponent(argv.id),
	};

	reg.authed(opts, function(err, res, hook)
	{
		if (err)
			return report.failure('hook rm', err.message);
		if (!hook || res.statusCode < 200 || res.statusCode >= 400)
			return report.failure('hook rm', res.statusCode + ' ' + JSON.stringify(hook));

		// TODO assumption here is that the body of the response is the updated hook
		report.success('–', hook.name + ' ✘ ' + hook.url);
	});
};

hooks.ls = function ls(argv)
{
	var reg = new Registry(argv);
	var uri = '/v1/hooks/hook';
	if (argv.pkg)
		uri += '/' + encodeURIComponent(argv.pkg);

	reg.authed({ uri: uri }, function(err, res, body)
	{
		if (err)
			return report.failure('hook ls', err.message);
		if (!body || res.statusCode < 200 || res.statusCode >= 400)
			return report.failure('hook ls', res.statusCode + ' ' + JSON.stringify(body));

		// TODO format the response once we know what it looks like
		report.success('hook ls', JSON.stringify(body));
	});
};

hooks.update = function update(argv)
{
	// TODO match with service
	report.success('hook update', 'updating hook id ' + chalk.yellow(argv.id));
	var reg = new Registry(argv);
	var opts = {
		method: 'PUT',
		uri: '/v1/hooks/hook/' + encodeURIComponent(argv.id),
		json: {
			url:    argv.url,
			secret: argv.secret
		}
	};

	reg.authed(opts, function(err, res, hook)
	{
		if (err)
			return report.failure('hook update', err.message);
		if (!hook || res.statusCode < 200 || res.statusCode >= 400)
			return report.failure('hook update', res.statusCode + ' ' + JSON.stringify(hook));

		// TODO assumption here is that the body of the response is the updated hook
		report.success('+', hook.name + ' ➜ ' + hook.url);
	});
};

hooks.test = function test(argv)
{
	// TODO match with service
	report.success('hook test', 'testing hook id ' + chalk.yellow(argv.id));

	var reg = new Registry(argv);
	var uri = '/v1/hooks/hook/' + encodeURIComponent(argv.pkg) + '/test';

	reg.authed({ uri: uri }, function(err, res, body)
	{
		if (err)
			return report.failure('hook test', err.message);
		if (!body || res.statusCode < 200 || res.statusCode >= 400)
			return report.failure('hook test', res.statusCode + ' ' + JSON.stringify(body));

		// TODO format the response
		report.success('hook test', JSON.stringify(body));
	});
};

function noop() {}

function builder(yargs)
{
	return yargs
		.command('ls [pkg]', 'list your hooks', noop, hooks.ls)
		.command('add <pkg> <url> <secret>', 'add a hook to the named package', noop, hooks.add)
		.command('update <id> <url> [secret]', 'update an existing hook', noop, hooks.update)
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
