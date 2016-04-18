/*global describe:true, it:true, before:true, after:true, beforeEach: true, afterEach:true */
'use strict';

var
	demand   = require('must'),
	sinon    = require('sinon'),
	Config = require('../lib/config')
	;

describe('configuration', function()
{
	it('exports a constructor', function()
	{
		var cfg = new Config();
		cfg.must.be.instanceof(Config);
		cfg.must.have.property('config');
	});

	it('section() returns the named section', function()
	{
		var cfg = new Config();
		cfg.section.must.be.a.function();
		var chunk = cfg.section({ registry: 'registry.npmjs.org' });
		chunk.must.be.an.object();
		chunk.must.have.property('api');

		var chunk2 = cfg.section({ registry: 'blort' });
		chunk.must.be.an.object();
		chunk.must.have.property('api');
	});
});
