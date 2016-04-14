var
	config       = require('rc')('npm', { registry: 'https://registry.npmjs.org/' }),
	getAuthToken = require('registry-auth-token'),
	Request      = require('request'),
	url          = require('url')
	;

function authed(method, uri, body, callback)
{
	if (typeof body === 'function')
	{
		callback = body;
		body = null;
	}

	var registry = config.registry;
	if (!registry)
		return callback(new Error('no registry set'));

	var token = getAuthToken();
	if (!token)
		return callback(new Error('no auth token in npmrc'));

	var options = {
		url: url.resolve(registry, uri),
		method: method,
		json: body || true,
		auth: { bearer: token }
	};

	Request(options, callback);
}

function anonymous(method, uri, body, callback)
{
	// TODO yeah copy pasta
	if (typeof body === 'function')
	{
		callback = body;
		body = null;
	}

	var registry = config.registry;
	if (!registry)
		return callback(new Error('no registry set'));

	var options = {
		url: url.resolve(registry, uri),
		method: method,
		json: body || true,
	};

	Request(options, callback);
}

module.exports = {
	authed: authed,
	anonymous: anonymous
};
