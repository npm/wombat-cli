var
	Registry = require('../lib/registry'),
	report   = require('../lib/report')
	;

function hooks(argv)
{
	// TODO
}

module.exports = {
	description: 'control your webhooks',
	func: hooks
};
