/*global describe:true, it:true, before:true, after:true, beforeEach: true, afterEach:true */
'use strict';

var
	demand = require('must'),
	Config = require('../lib/config'),
	assign = require('lodash.assign')
	;

describe('configuration', function()
{
	it('exports a constructor', function()
	{
		var cfg = new Config({ registry: 'default' }, assign({}, Config.DEFAULTS));
		cfg.must.be.instanceof(Config);
		cfg.must.have.property('config');
		cfg.get.must.be.a.function();
		cfg.load.must.be.a.function();
	});

	it('makes one even without the new', function()
	{
		var cfg = new Config({ registry: 'default' }, assign({}, Config.DEFAULTS));
		cfg.must.be.instanceof(Config);
		cfg.must.have.property('config');
	});

	it('the constructor sets a section', function()
	{
		var cfg = new Config({ registry: 'default' }, assign({}, Config.DEFAULTS));
		cfg.section.must.equal('default');
	});

	it('load() returns the named section', function()
	{
		var cfg = new Config({ registry: 'default' }, assign({}, Config.DEFAULTS));
		cfg.load.must.be.a.function();
		var chunk = cfg.load('default');
		chunk.must.be.an.object();
		chunk.must.have.property('api');

		var chunk2 = cfg.load({ registry: 'blort' });
		demand(chunk2).not.exist();
	});

	it('get() returns the key for the named value', function()
	{
		var cfg = new Config({ registry: 'default' }, assign({}, Config.DEFAULTS));
		var value = cfg.get('api');
		value.must.equal('https://registry.npmjs.org/-/npm');
	});

	it('set() sets a value in the current config section', function()
	{
		var cfg = new Config({ registry: 'default' }, assign({}, Config.DEFAULTS));
		cfg.set('username', 'dimwitflathead');
		cfg.config.default.must.have.property('username');
		cfg.config.default.username.must.equal('dimwitflathead');
		cfg._dirty.must.be.true();
		cfg.get('username').must.equal('dimwitflathead');
	});

	it('write() is a thing that exists', function()
	{
		var cfg = new Config({ registry: 'default' }, assign({}, Config.DEFAULTS));
		cfg.must.have.property('write');
		cfg.write.must.be.a.function();
	});
});
