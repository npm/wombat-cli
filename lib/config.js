var rc = require('rc');

var DEFAULTS = {
	'registry.npmjs.org': {
		'api': 'https://api.npmjs.org'
	}
};

var defaultRegistry = 'registry.npmjs.org';
var config = rc('wombat', DEFAULTS);

function WombatRC()
{
	if (!(this instanceof WombatRC)) return new WombatRC();

	this.config = config;
	this.section = null;
	if (!config.configs)
	{
		// We did not find a file. We're rolling with defaults.
		// We could write one now! Or not.
	}
}

WombatRC.prototype.config = null;
WombatRC.prototype.section = null;

WombatRC.prototype.load = function section(argv)
{
	// takes a yargs argv argument; responds with what we want
	var registry = argv.registry || defaultRegistry;
	this.section = this.config[registry] || DEFAULTS[registry];
	return this.section;
};


WombatRC.prototype.get = function get(key)
{
	return this.section[key];
};

module.exports = WombatRC;
WombatRC.DEFAULTS = DEFAULTS;
