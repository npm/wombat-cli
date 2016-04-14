/*global describe:true, it:true, before:true, after:true, beforeEach: true, afterEach:true */
'use strict';

var
	demand   = require('must'),
	sinon    = require('sinon'),
	Registry = require('../lib/registry'),
	Request  = require('request')
	;

describe('registry client', function()
{
	it('exports two functions', function()
	{
		Registry.must.have.property('authed');
		Registry.authed.must.be.a.function();
		Registry.must.have.property('anonymous');
		Registry.anonymous.must.be.a.function();

		// dependency injection, or as I like to call it, passing arguments to functions
		Registry.inject.must.be.a.function();
	});

	it('anonymous() calls request with the passed uri', function(done)
	{
		var expected = {
			url: 'http://registry.example.com/foo',
			method: 'GET',
			json: true,
		};
		var spy = sinon.stub();
		spy.yields(null, 'response', 'body');

		Registry.inject({ config: { registry: 'http://registry.example.com/ '}, requestfunc: spy });

		Registry.anonymous('GET', '/foo', function(err, res, body)
		{
			demand(err).not.exist();
			res.must.equal('response');
			body.must.equal('body');
			spy.calledWith(expected).must.be.true();

			done();
		});
	});

	it('anonymous() responds with an error when there is no registry', function(done)
	{
		Registry.inject({ config: {},  requestfunc: Request });
		Registry.anonymous('GET', '/foo', function(err, res, body)
		{
			err.must.be.an.object();
			err.must.match(/no registry set/);
			done();
		});
	});

	it('authed() responds with an error when there is no registry', function(done)
	{
		Registry.inject({ config: {},  requestfunc: Request });
		Registry.authed('GET', '/foo', function(err, res, body)
		{
			err.must.be.an.object();
			err.must.match(/no registry set/);
			done();
		});
	});

	it('authed() responds with an error when there is no auth token', function(done)
	{
		var authstub = sinon.stub();
		authstub.returns(null);

		Registry.inject({ config: { registry: 'http://registry.example.com/ '}, getAuthToken: authstub });
		Registry.authed('GET', '/foo', function(err, res, body)
		{
			err.must.be.an.object();
			err.must.match(/no auth token in npmrc/);
			done();
		});
	});

	it('authed() calls request with the passed uri', function(done)
	{
		var expected = {
			url: 'http://registry.example.com/foo',
			method: 'GET',
			json: true,
			auth: { bearer: 'i-am-a-token' },
		};
		var requestSpy = sinon.stub();
		requestSpy.yields(null, 'response', 'body');

		var authstub = sinon.stub();
		authstub.returns('i-am-a-token');

		Registry.inject({ config: {
			registry: 'http://registry.example.com/ '},
			getAuthToken: authstub,
			requestfunc: requestSpy
		});

		Registry.authed('GET', '/foo', function(err, res, body)
		{
			demand(err).not.exist();
			res.must.equal('response');
			body.must.equal('body');
			requestSpy.calledWith(expected).must.be.true();

			done();
		});
	});



});
