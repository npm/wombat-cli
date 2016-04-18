var rc = require('rc');

var DEFAULTS = {
	'registry.npmjs.org': {
		'api': 'https://api.npmjs.org'
	}
};

var config = rc('wombat', DEFAULTS);

function Configuration()
{
	if (!this instanceof Configuration) return new Configuration();
	this.config = config;
	if (!config.configs)
	{
		// We did not find a file. We're rolling with defaults.
		// We could write one now! Or not.
	}
}

Configuration.prototype.config = null;

Configuration.prototype.section = function section(argv)
{
	// TODO
	// takes a yargs argv argument; responds with what we want
	if (this.config[argv.registry])
		return this.config[argv.registry];

	return DEFAULTS['registry.npmjs.org'];
};

module.exports = Configuration;
Configuration.DEFAULTS = DEFAULTS;
