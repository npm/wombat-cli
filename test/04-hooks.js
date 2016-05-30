/*global describe:true, it:true, before:true, after:true, beforeEach: true, afterEach:true */
'use strict';

var
	demand   = require('must'),
	Registry = require('../lib/registry'),
	Report   = require('../lib/report'),
	sinon    = require('sinon'),
	hook     = require('../commands/hook')
	;

describe('hook command', function()
{
	describe('exports', function()
	{
		it('is a yargs command module', function()
		{
			hook.must.be.an.object();

			hook.must.have.property('command');
			hook.command.must.be.a.string();
			hook.command.must.equal('hook');

			hook.must.have.property('describe');
			hook.describe.must.be.a.string();

			hook.must.have.property('builder');
			hook.builder.must.be.a.function();

			hook.must.have.property('handler');
			hook.handler.must.be.a.function();
		});

		it('exports the expected commands', function()
		{
			['ls', 'add', 'update', 'rm'].forEach(function(cmd)
			{
				hook.handler.must.have.property(cmd);
				hook.handler[cmd].must.be.a.function();
			});
		});
	});

	describe('hook.ls', function()
	{
		it('calls Registry.authed', function()
		{
			var spy = sinon.spy(console, 'log');
			var reg = Registry();
			var stub = sinon.stub(reg, 'authed');
			stub.yields(null, { statusCode: 200 }, { objects: [] });

			hook.handler.ls({ reg: reg });

			stub.calledOnce.must.be.true();
			stub.calledWith({ uri: '/v1/hooks' }).must.be.true();
			stub.restore();
			spy.called.must.be.true();
			spy.calledWith('\u001b[33mhooks\u001b[39m you do not have any hooks configured yet.').must.be.true();
			spy.restore();
		});
	});


	describe('hook.add', function()
	{
		it('calls Registry.authed', function()
		{
			var spy = sinon.spy(Report, 'success');
			var reg = Registry();
			var stub = sinon.stub(reg, 'authed');
			stub.yields(null, { statusCode: 200 }, { id: 'foo', name: 'bar', endpoint: 'baz' });
			var payload = { reg: reg, pkg: 'foo', type: 'package', url: 'url', secret: 'secret' };

			hook.handler.add(payload);

			stub.calledOnce.must.be.true();
			stub.calledWith({
				method: 'POST',
				uri: '/v1/hooks/hook/',
				body: {
					type: payload.type,
					name: payload.pkg,
					endpoint: payload.url,
					secret: payload.secret,
				}
			}).must.be.true();
			stub.restore();
			spy.called.must.be.true();
			spy.calledWith('+', 'bar ➜ baz').must.be.true();
			spy.restore();
		});
	});

	describe('hook.update', function()
	{
		it('calls Registry.authed', function()
		{
			var spy = sinon.spy(Report, 'success');
			var reg = Registry();
			var stub = sinon.stub(reg, 'authed');
			stub.yields(null, { statusCode: 200 }, { id: 'foo', name: 'bar', endpoint: 'baz' });
			var payload = { reg: reg, id: 'wat', url: 'url', secret: 'secret' };

			hook.handler.update(payload);

			stub.calledOnce.must.be.true();
			stub.calledWith({
				method: 'PUT',
				uri: '/v1/hooks/hook/wat',
				body: {
					endpoint: payload.url,
					secret: payload.secret,
				}
			}).must.be.true();
			stub.restore();
			spy.called.must.be.true();
			spy.calledWith('+', 'bar ➜ baz').must.be.true();
			spy.restore();
		});
	});

	describe('hook.rm', function()
	{
		it('calls Registry.authed', function()
		{
			var spy = sinon.spy(Report, 'success');
			var reg = Registry();
			var stub = sinon.stub(reg, 'authed');
			stub.yields(null, { statusCode: 200 }, { id: 'foo', name: 'watched', endpoint: 'no more' });
			var payload = { reg: reg, id: 'wat', url: 'url', secret: 'secret' };

			hook.handler.rm(payload);

			stub.calledOnce.must.be.true();
			stub.calledWith({
				method: 'DELETE',
				uri: '/v1/hooks/hook/wat',
			}).must.be.true();
			stub.restore();
			spy.called.must.be.true();
			spy.calledWith('–', 'watched ✘ no more').must.be.true();
			spy.restore();
		});
	});
});
