var
	fs      = require('fs'),
	path    = require('path'),
	rc      = require('rc'),
	toml    = require('toml'),
	tomlify = require('tomlify-j0.4')
	;

var DEFAULTS = {
	'default': {
		'registry': 'https://registry.npmjs.org',
		'api': 'https://api.npmjs.org'
	}
};

function WombatRC(argv)
{
	argv = argv || { registry: 'default' };
	if (!(this instanceof WombatRC)) return new WombatRC(argv);

	this.config = rc('wombat', DEFAULTS, null, toml.parse);
	this.load(argv.registry);
	if (this.config.configs)
		this.cpath = this.config.configs[0];
	else
	{
		// I will just guess that this is not enough.
		this.cpath = path.join(process.env.HOME, '.wombatrc');
		this._dirty = true;
	}
}

WombatRC.prototype.section = 'default';
WombatRC.prototype._dirty = false;

WombatRC.prototype.load = function section(desired)
{
	var section = desired || 'default';
	if (this.config.hasOwnProperty(section))
		this.section = section;

	return this.config[section];
};

WombatRC.prototype.write = function write(callback)
{
	if (!callback) callback = function() {};

	var self = this;
	if (!self._dirty) return callback();
	var data = tomlify(self.config, null, 4);
	fs.writeFile(self.cpath, data, callback);
};

WombatRC.prototype.get = function get(key)
{
	return this.config[this.section][key];
};

WombatRC.prototype.set = function set(key, value)
{
	this.config[this.section][key] = value;
	this._dirty = true;
};

module.exports = WombatRC;
WombatRC.DEFAULTS = DEFAULTS;
