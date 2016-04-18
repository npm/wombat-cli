var
	Registry = require('../lib/registry'),
	report   = require('../lib/report')
	;

function whoami(argv)
{
	var reg = argv.reg || new Registry(argv);

	reg.authed({ method: 'GET', uri: '/-/whoami', legacy: true }, function(err, res, body)
	{
		if (err)
			return report.failure('whoami', err.message);
		if (!body || !body.username)
			return report.failure('whoami', 'unexpected registry response! ' + JSON.stringify(body));

		console.log(body.username.trim());
	});
	argv._handled = true;
}

module.exports = {
	command: 'whoami',
	describe: 'the username you are authenticated as',
	handler: whoami,
	builder: function(){}
};
