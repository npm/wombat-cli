var
	npmconf = require('npmconf'),
	report  = require('../lib/report'),
	Request = require('request'),
	url     = require('url')
	;

function whoami(argv)
{
	npmconf.load(function(err, config)
	{
		var registry = config.get('registry');
		if (!registry)
			return report.failure('whoami', 'no registry set');

		var auth = config.getCredentialsByURI(registry);
		if (auth.username)
			return report.success('whoami', auth.username);

		var options = {
			url: url.resolve(registry, '-/whoami'),
			method: 'GET',
			headers: {
				authorization: 'Bearer ' + auth.token
			},
			json: true,
		};

		Request(options, function(err, res, body)
		{
			if (err)
				return report.failure('whoami', err.message);
			if (!body || !body.username)
				return report.failure('whoami', 'unexpected registry response! ' + JSON.stringify(body));

			console.log(body.username);
		});
	});
}

module.exports = {
	description: 'which npm user are you',
	func: whoami
};
