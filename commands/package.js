var
	chalk    = require('chalk'),
	columns  = require('cli-columns'),
	moment   = require('moment'),
	Registry = require('../lib/registry'),
	report   = require('../lib/report')
	;

function encodePackageName(input)
{
	return encodeURIComponent(input).replace('%40', '@');
}

function formatUser(user)
{
	return chalk.blue(user.name) + ' <' + user.email + '>';
}

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
	argv._handled = true;
	var reg = argv.reg || new Registry(argv);
	var opts = {
		uri: encodePackageName(argv.package),
		legacy: true
	};

	reg.authed(opts, function(err, response, pkg)
	{
		if (err)
			return report.failure('package', err.message);
		if (response.statusCode === 404)
			return report.success('package', 'package ' + argv.package + ' was not found.');
		if (!pkg)
			return report.failure('package', 'unexpected registry response! ' + JSON.stringify(pkg));

		require('normalize-package-data')(pkg);

		if (argv.json)
		{
			report.json(pkg);
			return;
		}

		if (!pkg['dist-tags'])
		{
			report.failure('package', 'this package is probably broken');
			console.log(Object.keys(pkg));
			report.json(pkg);
			return;
		}

		var latest = pkg['dist-tags'].latest;
		var version = pkg.versions[latest];

		console.log('');
		console.log(chalk.blue(pkg.name) + '@' + chalk.blue(latest));
		console.log('published ' + moment(pkg.time[latest]).format('lll'));
		if (version._npmUser)
			console.log('by ' + formatUser(version._npmUser));
		console.log('');
		console.log(pkg.description);
		console.log('');

		if (pkg.license) console.log('license: ' + chalk.magenta(pkg.license));
		console.log('on npm: ' + chalk.magenta('https://www.npmjs.com/package/' + encodePackageName(pkg.name)));
		if (pkg.homepage) console.log('homepage: ' + chalk.magenta(pkg.homepage));
		console.log('tarball: ' + chalk.magenta(version.dist.tarball));
		console.log('shasum: ' + chalk.magenta(version.dist.shasum));

		console.log('');
		console.log(chalk.blue('maintainers:'));
		pkg.maintainers.forEach(function(m) { console.log(formatUser(m)); });

		console.log('');
		console.log(chalk.blue('dependencies:'));
		var deps = [];
		Object.keys(version.dependencies || []).forEach(function(d)
		{
			deps.push(chalk.yellow(d) + ': ' + version.dependencies[d]);
		});
		if (!deps.length)
			console.log('none');
		else
			console.log(columns(deps));

		console.log('');
		console.log(chalk.blue('development dependencies:'));
		deps = [];
		Object.keys(version.devDependencies || []).forEach(function(d)
		{
			deps.push(chalk.yellow(d) + ': ' + version.devDependencies[d]);
		});
		if (!deps.length)
			console.log('none');
		else
			console.log(columns(deps));

		console.log('');
		console.log(chalk.blue('versions & dist tags:'));
		var versions = [];
		Object.keys(pkg.versions).forEach(function(v)
		{
			versions.push(chalk.yellow(v) + ': ' + moment(pkg.time[v]).format('lll'));
		});
		if (versions.length === 1)
			console.log('1 version published');
		else if (versions.length > 10)
			console.log(versions.length + ' versions published');
		else
		{
			console.log(columns(versions));
		}
		var disttags = [];
		Object.keys(pkg['dist-tags']).forEach(function(tag)
		{
			disttags.push(chalk.yellow(tag) + ': ' + pkg['dist-tags'][tag]);
		});
		console.log(columns(disttags));

		if (argv.readme)
		{
			var markdown = require('markdown-it')();
			var terminal = require('markdown-it-terminal');

			markdown.use(terminal);
			console.log('');
			console.log(markdown.render(pkg.readme));
		}
	});
}

module.exports = {
	command: 'package <package>',
	describe: 'see information about the named package',
	handler: view,
	builder: builder
};
