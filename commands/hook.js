var
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
	var type = argv.type;

	// @npm
	// not @npm/foo
	if ((pkg.indexOf('@') === 0 && pkg.indexOf('/') === -1) || argv.type === 'scope')
	{
		type = 'scope';
	}

    if (type) argv.type = type;

    if (type === 'scope' && pkg[0] !== '@' && pkg.length)
	{
		argv.pkg = '@' + pkg;
	}

	var reg = argv.reg || new Registry(argv);
	var opts = {
		method: 'POST',
		uri: '/v1/hooks/hook/',
		body: {
			type:     argv.type,
			name:     argv.pkg,
			endpoint: argv.url,
			secret:   argv.secret
		}
	};

	reg.authed(opts, function(err, res, hook)
	{
		if (err)
			return report.failure('hook add', err.message);
		if (!hook || res.statusCode < 200 || res.statusCode >= 400)
			return report.failure('hook add', res.statusCode + ' ' + JSON.stringify(hook));

		if (argv.json)
			report.json(hook);
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
			report.json(hook);
		else
			report.success('–', hook.name + ' ✘ ' + hook.endpoint);
	});
};

hooks.ls = function ls(argv)
{
	var reg = argv.reg || new Registry(argv);
	var uri = '/v1/hooks';
	if (argv.pkg)
		uri += '?package=' + encodeURIComponent(argv.pkg);

	reg.authed({ uri: uri }, function(err, res, body)
	{
		if (err)
			return report.failure('hook ls', err.message);
		if (!body || res.statusCode < 200 || res.statusCode >= 400)
			return report.failure('hook ls', res.statusCode + ' ' + JSON.stringify(body));

		if (argv.json)
			report.json(body.objects);
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
				if (hook.last_delivery)
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
			report.json(hook);
		else
		{
			report.success('+', hook.name + ' ➜ ' + hook.endpoint);
		}
	});
};

function noop() {}

function builder(yargs)
{
	return yargs
		.command('ls [pkg]', 'list your hooks', noop, hooks.ls)
		.command('add <pkg> <url> <secret>', 'add a hook to the named package or object', function buildAdd(yargs)
		{
			return yargs.option('type', {
				alias:       't',
				description: 'one of owner, scope, or package.\nyou can hook specific packages but also objects that are related to many packages.\t@scope and package are taken care of for you, but to make an owner hook (like all packages substack maintains) don\'t forget --type owner',
				default:     'package'
			});
		}, hooks.add)
		.command('update <id> <url> [secret]', 'update an existing hook', noop, hooks.update)
		.command('rm <id>', 'remove a hook', noop, hooks.rm)
		.usage('wombat hook [options]\nadd or change web hooks')
		.example('wombat hook add lodash https://example.com/ my-shared-secret')
		.example('wombat hook add --type=owner substack https://example.com/ my-shared-secret')
		.example('wombat hook ls lodash')
		.example('wombat hook rm id-ers83f')
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
