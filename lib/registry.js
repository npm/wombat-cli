var
	config       = require('./config')(),
	npmrc        = require('rc')('npm', { registry: 'https://registry.npmjs.org/' }),
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

	this.registry = argv.registry || npmrc.registry;
	this.config = config;
	this.config.load({registry:this.registry});
	this.api = argv.api || config.get('api')

	// so we can inject dependencies for testing
	this.requestfunc = Request;
	this.getAuthToken = getAuthToken;
};

Registry.prototype._registry = null;

Registry.prototype.authed = function authed(opts, callback)
{
	var token = this.getAuthToken(this.registry);
	if (!token)
		return callback(new Error('you are not logged into the registry you are trying to use "'+this.registry+'"'));
	var hostname = opts.legacy ? this.registry : this.api;

	var options = {
		url:    url.resolve(hostname, opts.uri),
		method: opts.method,
		json:   opts.body || true,
		auth:   { bearer: token }
	};
	this.requestfunc(options, callback);
};

Registry.prototype.anonymous =  function anonymous(opts, callback)
{
	var hostname = opts.legacy ? this.registry : this.api;
	var options = {
		url:    url.resolve(hostname, opts.uri),
		method: opts.method,
		json:   opts.body || true,
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
Object.defineProperty(Registry.prototype, 'registry', {set: setReg, get: getReg, enumerable: true});

module.exports = Registry;

function verboseRequest(cb){
	return function (err,res,body)
	{
		process.emit('log',{type:"request",})
		cb(err,res,body)
	}
}
