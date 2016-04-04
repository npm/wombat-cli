var
	npmconf  = require('npmconf'),
	Registry = require('../lib/registry'),
	report   = require('../lib/report')
	;

function whoami(argv)
{
	npmconf.load(function(err, config)
	{
		if (err)
			return report.failure('whoami', err.message);

		var registry = config.get('registry');
		if (!registry)
			return report.failure('whoami', 'no registry set');

		var auth = config.getCredentialsByURI(registry);
		if (auth.username)
			return report.success('whoami', auth.username);

		Registry.authed('GET', '-/whoami', function(err, res, body)
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
	command: 'whoami',
	describe: 'the username you are authenticated as',
	handler: whoami,
	builder: function(){}
};
