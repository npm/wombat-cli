/*global describe:true, it:true, before:true, after:true, beforeEach: true, afterEach:true */
'use strict';

var
	assign   = require('lodash.assign'),
	demand   = require('must'),
	sinon    = require('sinon'),
	Registry = require('../lib/registry'),
	Config   = require('../lib/config')
	;

describe('registry client', function()
{
	describe('constructor', function()
	{
		it('can be constructed', function()
		{
			Registry.must.be.a.function();
		});

		it('exports some functions', function()
		{
			var reg = Registry();

			reg.must.have.property('authed');
			reg.authed.must.be.a.function();
			reg.must.have.property('anonymous');
			reg.anonymous.must.be.a.function();

			reg.must.have.property('registry');
		});
	});

	describe('anonymous()', function()
	{
		it('calls request with the passed uri', function(done)
		{
			var reg = Registry();
			reg.config = new Config({ registry: 'default' }, assign({}, Config.DEFAULTS));

			var expected = {
				url: 'https://registry.npmjs.org/foo',
				method: 'GET',
				json: true,
			};

			var spy = sinon.stub();
			spy.yields(null, 'response', 'body');
			reg.requestfunc = spy;

			reg.anonymous({ method: 'GET', uri: '/foo' }, function(err, res, body)
			{
				demand(err).not.exist();
				res.must.equal('response');
				body.must.equal('body');
				spy.args[0][0].must.eql(expected);

				done();
			});
		});

		it('passes along a body parameter', function(done)
		{
			var expected = {
				url: 'https://registry.npmjs.org/foo',
				method: 'POST',
				json: { data: 'yes' },
			};

			var requestSpy = sinon.stub();
			requestSpy.yields(null, 'response', 'body');

			var reg = Registry();
			reg.config = new Config({ registry: 'default' }, assign({}, Config.DEFAULTS));
			reg.requestfunc = requestSpy;

			reg.anonymous({ method: 'POST', uri: '/foo', json: { data: 'yes' } }, function(err, res, body)
			{
				demand(err).not.exist();
				res.must.equal('response');
				body.must.equal('body');
				requestSpy.calledWith(expected).must.be.true();

				done();
			});
		});
	});

	describe('authed()', function()
	{
		it('calls request with the passed uri', function(done)
		{
			var expected = {
				url: 'https://registry.npmjs.org/-/npm/foo',
				method: 'GET',
				json: true,
				auth: { bearer: 'i-am-a-token' },
			};
			var requestSpy = sinon.stub();
			requestSpy.yields(null, 'response', 'body');

			var authstub = sinon.stub();
			authstub.returns('i-am-a-token');

			var reg = Registry();
			reg.config = new Config({ registry: 'default' }, assign({}, Config.DEFAULTS));
			reg.getAuthToken = authstub;
			reg.requestfunc = requestSpy;

			reg.authed({ method: 'GET', uri: '/foo' }, function(err, res, body)
			{
				demand(err).not.exist();
				res.must.equal('response');
				body.must.equal('body');
				requestSpy.calledWith(expected).must.be.true();

				done();
			});
		});

		it('passes along a body parameter', function(done)
		{
			var expected = {
				url: 'https://registry.npmjs.org/-/npm/foo',
				method: 'GET',
				json: { data: 'yes' },
				auth: { bearer: 'i-am-a-token' },
			};

			var requestSpy = sinon.stub();
			requestSpy.yields(null, 'response', 'body');

			var authstub = sinon.stub();
			authstub.returns('i-am-a-token');

			var reg = Registry();
			reg.config = new Config({ registry: 'default' }, assign({}, Config.DEFAULTS));
			reg.getAuthToken = authstub;
			reg.requestfunc = requestSpy;

			reg.authed({ method: 'GET', uri: '/foo', body: { data: 'yes' } }, function(err, res, body)
			{
				demand(err).not.exist();
				res.must.equal('response');
				body.must.equal('body');
				requestSpy.calledWith(expected).must.be.true();

				done();
			});
		});
	});
});
