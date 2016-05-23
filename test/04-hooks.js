/*global describe:true, it:true, before:true, after:true, beforeEach: true, afterEach:true */
'use strict';

var
	demand  = require('must'),
//	sinon   = require('sinon'),
	hook    = require('../commands/hook')
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
		it('has tests');
	});


	describe('hook.add', function()
	{
		it('has tests');
	});

	describe('hook.update', function()
	{
		it('has tests');
	});

	describe('hook.rm', function()
	{
		it('has tests');
	});

	describe('hook.test', function()
	{
		it('has tests');
	});
});
