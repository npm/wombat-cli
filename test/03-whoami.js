/*global describe:true, it:true, before:true, after:true, beforeEach: true, afterEach:true */
'use strict';

var
	demand   = require('must'),
	Registry = require('../lib/registry'),
	Report   = require('../lib/report'),
	sinon    = require('sinon'),
	whoami   = require('../commands/whoami')
	;

describe('whoami command', function()
{
	it('is a yargs command module', function()
	{
		whoami.must.be.an.object();

		whoami.must.have.property('command');
		whoami.command.must.be.a.string();
		whoami.command.must.equal('whoami');

		whoami.must.have.property('describe');
		whoami.describe.must.be.a.string();

		whoami.must.have.property('builder');
		whoami.builder.must.be.a.function();

		whoami.must.have.property('handler');
		whoami.handler.must.be.a.function();
	});

	it('calls Registry.authed', function()
	{
		var spy = sinon.spy(console, 'log');
		var reg = Registry();
		var stub = sinon.stub(reg, 'authed');
		stub.yields(null, { statusCode: 200 }, { username: 'test '});

		whoami.handler({ reg: reg });

		stub.calledOnce.must.be.true();
		stub.calledWith({ method: 'GET', uri: '/-/whoami', legacy: true }).must.be.true();
		stub.restore();
		spy.calledWith('test').must.be.true();
		spy.restore();
	});

	it('logs an error on networking error', function()
	{
		var spy = sinon.spy(Report, 'failure');
		var reg = Registry();
		var stub = sinon.stub(reg, 'authed');
		stub.yields(new Error('wat'));
		whoami.handler({ reg: reg });
		stub.calledOnce.must.be.true();
		stub.restore();
		spy.calledOnce.must.be.true();
		spy.restore();
	});

	it('logs an error on unexpected response', function()
	{
		var spy = sinon.spy(Report, 'failure');
		var reg = Registry();
		var stub = sinon.stub(reg, 'authed');
		stub.yields(null, { statusCode: 401 }, { error: 'wat' });
		whoami.handler({ reg: reg });
		stub.calledOnce.must.be.true();
		stub.restore();
		spy.calledOnce.must.be.true();
		spy.restore();
	});

	it('sets the ._handled field on its input', function()
	{
		var reg = Registry();
		var stub = sinon.stub(reg, 'authed');
		stub.yields(null, { statusCode: 200 }, { username: 'test '});
		var argv = { reg: reg };
		whoami.handler(argv);
		stub.restore();
		argv.must.have.property('_handled');
		argv._handled.must.be.true();
	});
});
