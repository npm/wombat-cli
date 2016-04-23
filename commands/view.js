var
	chalk    = require('chalk'),
	columns  = require('cli-columns'),
	Registry = require('../lib/registry'),
	report   = require('../lib/report')
	;

function whoami(argv)
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
		console.log(chalk.bold.red(pkg.name) + ' @ ' + latest);
		console.log('published by ' + chalk.blue(version._npmUser.name) + ' <' + version._npmUser.email + '>');
		console.log(pkg.homepage);
		console.log('License: ' + pkg.license);
		console.log('');
		console.log(pkg.description);
		console.log('');

		console.log('Versions: ' + Object.keys(pkg.versions).join(', '))
		console.log('');

		console.log('Dependencies:');
		var deps = [];
		Object.keys(version.dependencies).forEach(function(d)
		{
			deps.push(chalk.yellow(d) + ': ' + version.dependencies[d]);
		})
		console.log(columns(deps));

		console.log('');
		console.log('Development dependencies:');
		deps = [];
		Object.keys(version.devDependencies).forEach(function(d)
		{
			deps.push(chalk.yellow(d) + ': ' + version.devDependencies[d]);
		});
		console.log(columns(deps));

		console.log('');
		// console.log(pkg.readme);
	});
	argv._handled = true;
}

module.exports = {
	command: 'view <package>',
	describe: 'see information about the named package',
	handler: whoami,
	builder: function(){}
};
