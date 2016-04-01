var
	npmconf = require('npmconf'),
	Request = require('request'),
	url     = require('url')
	;

function authed(method, uri, body, callback)
{
	if (typeof body === 'function')
	{
		callback = body;
		body = null;
	}

	npmconf.load(function(err, config)
	{
		if (err) return callback(err);
		var registry = config.get('registry');
		if (!registry)
			return callback(new Error('no registry set'));

		var auth = config.getCredentialsByURI(registry);
		if (!auth)
			return callback(new Error('no auth info in npmrc'));

		var options = {
			url: url.resolve(registry, uri),
			method: method,
			json: body || true,
			auth: {}
		};
		if (auth.token)
			options.auth.bearer = auth.token;
		else
			options.auth = auth;

		Request(options, callback);
	});
}

function anonymous(method, uri, body, callback)
{
	// TODO yeah copy pasta
	if (typeof body === 'function')
	{
		callback = body;
		body = null;
	}

	npmconf.load(function(err, config)
	{
		if (err) return callback(err);
		var registry = config.get('registry');
		if (!registry)
			return callback(new Error('no registry set'));

		var options = {
			url: url.resolve(registry, uri),
			method: method,
			json: body || true,
		};

		Request(options, callback);
	});
}

module.exports = {
	authed: authed,
	anonymous: anonymous
};
