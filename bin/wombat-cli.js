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
	yargs.command(c, commands[c].description, commands[c].func);
});

var argv = yargs.argv;
