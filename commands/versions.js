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

function versions(argv)
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

		console.log('');
		console.log(chalk.blue(pkg.name) + '@' + chalk.blue(latest));
		console.log('published ' + moment(pkg.time[latest]).format('lll'));

		var disttags = [];
		Object.keys(pkg['dist-tags']).forEach(function(tag)
		{
			disttags.push(chalk.yellow(tag) + ': ' + pkg['dist-tags'][tag]);
		});
		console.log('\ndist tags:');
		console.log(columns(disttags));
		console.log('');

		var versions = [];
		Object.keys(pkg.versions).forEach(function(v)
		{
			versions.push(chalk.yellow(v) + ': ' + moment(pkg.time[v]).format('lll'));
		});
		if (versions.length === 1)
			console.log('1 version published');
		else
			console.log(versions.length + ' versions published');
		console.log(columns(versions));

	});
}

module.exports = {
	command: 'versions <package>',
	describe: 'see all available versions for the named package',
	handler: versions,
	builder: function(){}
};
