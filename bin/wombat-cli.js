#!/usr/bin/env node

var updater = require('update-notifier'),
	pkg     = require('../package.json');

updater({pkg: pkg}).notify();

var yargs = require('yargs')
	.option('registry', {
		description: 'fully-qualified hostname of the registry to use',
		default: 'registry.npmjs.org'
	})
	.help('help')
	.version(function() { return require('../package').version; })
	.describe('version', 'show version information')
	.usage('the helpful wombat tool');

var requireDirectory = require('require-directory'),
	commands = requireDirectory(module, '../commands');

Object.keys(commands).forEach(function(c)
{
	var cmd = commands[c];
	yargs.command(commands[c]);

	if (cmd.aliases)
	{
		cmd.aliases.forEach(function(alias) { yargs.command(cmd).command(alias, false, cmd); });
	}
});

var argv = yargs.argv;

// wombat : npm :: hub : git
if (!argv._handled)
{
	var spawn = require('child_process').spawn;
	var opts = {
		cwd: process.cwd,
		env: process.env,
		stdio: 'inherit',
	};
	var original = process.argv.slice(2);
	spawn('npm', original, opts);
}
