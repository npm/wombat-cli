var
	Config       = require('./config'),
	getAuthToken = require('registry-auth-token'),
	Request      = require('request'),
	url          = require('url')
	;

/*
	Construct one of these and then make registry API calls with it.

	Call authed() to do something while passing an auth token.
	Call anonymous() if you don't need to be logged in to do it.
	Pass the `legacy: true` field in the opts argument if you need to hit an old
	registry endpoint.

	Set the `registry` property if you want to specify one of several registries in the
	wombatrc. If you pass the yargs `argv` options object to the constructor, it'll
	pick the one set in the `--registry` option. Otherwise it'll use what's in the npmrc.
*/

var Registry = module.exports = function Registry(argv)
{
	if (!(this instanceof Registry)) return new Registry();

	argv = argv || {};
	this.config = new Config(argv);

	// so we can inject dependencies for testing
	this.requestfunc = Request;
	this.getAuthToken = getAuthToken;
};

Registry.prototype._registry = null;
Registry.prototype._config = null;

Registry.prototype.authed = function authed(opts, callback)
{
	var auth = this.getAuthToken(this.registry) || {};

	var hostname = opts.legacy ? this.registry : this.api;

	// add a slash if it missing.
	// not using url.resolve so we can support api through the registry url paths. url.resolve(hostname, opts.uri),
	// https://registry.npmjs.org/-/api/v1/hooks/hook etc.
	// we should remove the default api url probably?
	if (opts.uri.indexOf('/') !== 0)
		opts.uri = '/' + opts.uri;

	var options = {
		url:    hostname + opts.uri,
		method: opts.method || 'GET',
		json:   opts.json || opts.body || true,
	};
	if (auth.token)
		options.auth = {bearer: auth.token};
	if(opts.otp)
		options.headers = {'npm-otp':opts.otp};
	this.requestfunc(options,callback);
};

Registry.prototype.anonymous =  function anonymous(opts, callback)
{
	var hostname = opts.legacy ? this.registry : this.api;
	var options = {
		url:    url.resolve(hostname, opts.uri),
		method: opts.method,
		json:   opts.json || opts.body || true
	};

	this.requestfunc(options, callback);
};

function getReg()
{
	return this._registry;
}

function setReg(v)
{
	if (!v.match(/^(http:\/\/|https:\/\/)/))
		v = 'https://' + v;
	v = v.replace(/\/$/, '');

	this._registry = v;
	return this._registry;
}
Object.defineProperty(Registry.prototype, 'registry', { set: setReg, get: getReg, enumerable: true });

function getConfig()
{
	return this._config;
}

function setConfig(v)
{
	this._config = v;
	this.api = this.config.get('api');
	this.registry = this.config.get('registry');
}
Object.defineProperty(Registry.prototype, 'config', { set: setConfig, get: getConfig, enumerable: true });

module.exports = Registry;
