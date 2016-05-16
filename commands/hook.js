var
	chalk    = require('chalk'),
	moment   = require('moment'),
	Table    = require('cli-table2'),
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
    var pkg = argv.pkg + '';
    // if the package is just a scope name set type to scope and save it!
	// @npm
	// not @npm/foo
	if(pkg.indexOf('@') === 0 && pkg.indexOf('/') === -1)
	{
		argv.type = 'scope';
	}

	var reg = new Registry(argv);
	var opts = {
		method: 'POST',
		uri: '/v1/hooks/hook/',
		body: {
			type: argv.type || 'package',
			name:   argv.pkg,
			endpoint:    argv.url,
			secret: argv.secret
		}
	};

	reg.authed(opts, function(err, res, hook)
	{
		if (err)
			return report.failure('hook add', err.message);
		if (!hook || res.statusCode < 200 || res.statusCode >= 400)
			return report.failure('hook add', res.statusCode + ' ' + JSON.stringify(hook));

		if (argv.json)
			console.log(JSON.stringify(hook, null, 4));
		else
			report.success('+', hook.name + ' ➜ ' + hook.endpoint);
	});
};

hooks.rm = function rm(argv)
{
	var reg = new Registry(argv);
	var opts = {
		method: 'DELETE',
		uri: '/v1/hooks/hook/' + encodeURIComponent(argv.id),
	};

	reg.authed(opts, function(err, res, hook)
	{
		if (err)
			return report.failure('hook rm', err.message);
		if (!hook || res.statusCode < 200 || res.statusCode >= 400)
			return report.failure('hook rm', res.statusCode + ' ' + JSON.stringify(hook));

		if (argv.json)
			console.log(JSON.stringify(hook, null, 4));
		else
			report.success('–', hook.name + ' ✘ ' + hook.endpoint);
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

		// body.objects, body.total body.urls doesnt not exist yet.
		if (argv.json)
			console.log(JSON.stringify(body.objects, null, 4));
		else
		{
			if (body.objects.length === 0)
			{
				report.success('hooks', 'you do not have any hooks configured yet.');
				return;
			}

			if (body.objects.length === 1)
				report.success('hooks', 'you have one hook');
			else
				report.success('hooks', 'you have ' + body.objects.length + ' hooks');

			var table = new Table({ head: ['id', 'type', 'target', 'endpoint'], });
			body.objects.forEach(function eachHook(hook)
			{
				table.push([
						{rowSpan: 2, content: hook.id},
						hook.type,
						hook.name,
						hook.endpoint]);
				if (hook.delivered)
				{
					table.push([{
						colSpan: 2,
						content: 'triggered ' + moment(hook.last_delivery).format('lll')},
						hook.response_code]);
				}
				else
					table.push([{colSpan:3, content:'never triggered'}]);
			});
			console.log(table.toString());
		}
	});
};

hooks.update = function update(argv)
{
	var reg = new Registry(argv);
	var opts = {
		method: 'PUT',
		uri: '/v1/hooks/hook/' + encodeURIComponent(argv.id),
		body: {
			endpoint: argv.url,
			secret: argv.secret
		}
	};

	reg.authed(opts, function(err, res, hook)
	{
		if (err)
			return report.failure('hook update', err.message);
		if (!hook || res.statusCode < 200 || res.statusCode >= 400)
			return report.failure('hook update', res.statusCode + ' ' + JSON.stringify(hook));

		if (argv.json)
			console.log(JSON.stringify(hook, null, 4));
		else
		{
			report.success('+', hook.name + ' ➜ ' + hook.endpoint);
		}
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

		if (argv.json)
			console.log(JSON.stringify(body, null, 4));
		else
		{
			// TODO format the response
			report.success('hook test', JSON.stringify(body));
		}
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
		.demand(2)
	;
}

module.exports = {
	command: 'hook',
	describe: 'control your hooks',
	builder: builder,
	handler: hooks,
	aliases: [ 'hooks' ]
};
