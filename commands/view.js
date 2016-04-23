var
	chalk    = require('chalk'),
	columns  = require('cli-columns'),
	moment   = require('moment'),
	Registry = require('../lib/registry'),
	report   = require('../lib/report')
	;

function builder(yargs)
{
	return yargs.option('readme', {
		alias: 'r',
		description: 'render the readme as well as package meta info',
		type: 'boolean',
	});
}

function view(argv)
{
	var reg = argv.reg || new Registry(argv);
	var opts = {
		method: 'GET',
		uri: '/' + encodeURIComponent(argv.package),
		legacy: true
	};

	reg.authed(opts, function(err, response, pkg)
	{
		if (err)
			return report.failure('view', err.message);
		if (response.statusCode === 404)
			return report.success('view', 'package ' + argv.package + ' was not found.');
		if (!pkg)
			return report.failure('view', 'unexpected registry response! ' + JSON.stringify(pkg));

		var latest = pkg['dist-tags'].latest;
		var version = pkg.versions[latest];

		console.log('');
		console.log(chalk.blue(pkg.name) + '@' + chalk.blue(latest));
		console.log('published ' + moment(pkg.time[latest]).format('lll'));
		console.log('by ' + chalk.blue(version._npmUser.name) + ' <' + version._npmUser.email + '>');
		console.log('');
		console.log(pkg.description);
		console.log('');

		console.log('license: ' + chalk.yellow(pkg.license));
		console.log('homepage: ' + chalk.yellow(pkg.homepage));
		console.log('tarball: ' + chalk.yellow(version.dist.tarball));
		console.log('shasum: ' + chalk.yellow(version.dist.shasum));

		console.log('');
		console.log('dependencies:');
		var deps = [];
		Object.keys(version.dependencies).forEach(function(d)
		{
			deps.push(chalk.yellow(d) + ': ' + version.dependencies[d]);
		});
		console.log(columns(deps));

		console.log('');
		console.log('development dependencies:');
		deps = [];
		Object.keys(version.devDependencies).forEach(function(d)
		{
			deps.push(chalk.yellow(d) + ': ' + version.devDependencies[d]);
		});
		console.log(columns(deps));

		console.log('');
		console.log('Versions: ' + Object.keys(pkg.versions).join(', '));

		if (argv.readme)
		{
			var markdown = require('markdown-it')();
			var terminal = require('markdown-it-terminal');

			markdown.use(terminal);
			console.log('');
			console.log(markdown.render(pkg.readme));
		}
	});
	argv._handled = true;
}

module.exports = {
	command: 'view <package>',
	describe: 'see information about the named package',
	handler: view,
	builder: builder
};
