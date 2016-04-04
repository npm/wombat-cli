#!/usr/bin/env node

var yargs = require('yargs')
	.help('help')
	.version(function() { return require('../package').version; })
	.describe('version', 'show version information')
	.usage('the helpful wombat tool');

var requireDirectory = require('require-directory'),
	commands = requireDirectory(module, '../commands');

Object.keys(commands).forEach(function(c)
{
	yargs.command(commands[c]);
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
