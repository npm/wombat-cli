#!/usr/bin/env node

var updater = require('update-notifier'),
	pkg     = require('../package.json');

updater({pkg: pkg}).notify();

var yargs = require('yargs')
	.option('registry', {
		alias: 'r',
		description: 'the registry configuration to use',
		default: 'default'
	})
	.option('json', {
		alias: 'j',
		description: 'send output as json',
		type: 'boolean',
		default: false,
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
	yargs.command(cmd);

	if (cmd.aliases)
	{
		cmd.aliases.forEach(function(alias) { yargs.command(alias, false, cmd); });
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
	spawn('npm', original, opts)
		.on('exit',function(code){ process.exit(code); });
}
