/*global describe:true, it:true, before:true, after:true, beforeEach: true, afterEach:true */
'use strict';

var
	demand   = require('must'),
	Registry = require('../lib/registry'),
	sinon    = require('sinon'),
	Package  = require('../commands/package')
	;

var pkgFixture = require('./fixtures/scurry.json');

describe('package command', function()
{
	it('is a yargs command module', function()
	{
		Package.must.be.an.object();

		Package.must.have.property('command');
		Package.command.must.be.a.string();
		Package.command.must.equal('package <package>');

		Package.must.have.property('describe');
		Package.describe.must.be.a.string();

		Package.must.have.property('builder');
		Package.builder.must.be.a.function();

		Package.must.have.property('handler');
		Package.handler.must.be.a.function();
	});

	it('calls Registry.authed', function()
	{
		var reg = Registry();
		var stub = sinon.stub(reg, 'authed');
		stub.yields(null, { statusCode: 200 }, pkgFixture);
		var spy = sinon.stub(console, 'log');

		Package.handler({ reg: reg, package: 'scurry' });

		stub.calledOnce.must.be.true();
		stub.calledWith({ uri: 'scurry', legacy: true }).must.be.true();
		stub.restore();
		spy.called.must.be.true();
		spy.restore();
	});

});
