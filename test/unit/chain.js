var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Flag = require('../..').Flag;
var Option = require('../..').Option;
var Command = require('../..').Command;

describe('cli-define:', function() {
  it('should define executable commands', function(done) {
    cli
      .command('ls', 'list files')
      .command('rm', 'remove files')
      .command('add', 'create a file');
    expect(cli._commands.ls).to.be.an
      .instanceof(Command);
    expect(cli._commands.rm).to.be.an
      .instanceof(Command);
    expect(cli._commands.add).to.be.an
      .instanceof(Command);
    done();
  });
  it('should define action commands', function(done) {
    cli
      .command('print')
        .description('print some data')
        .action(function(cmd, args) {});
    cli
      .command('cat')
        .description('concatenate some data')
        .action(function(cmd, args) {});
    expect(cli._commands.print).to.be.an
      .instanceof(Command);
    expect(cli._commands.print.action).to.be.a('function');
    expect(cli._commands.cat).to.be.an
      .instanceof(Command);
    expect(cli._commands.cat.action).to.be.a('function');
    done();
  });
  it('should define command tree', function(done) {
    var build = cli.command('build')
      .description('compile some files')
      .action(function(cmd, args) {});
    var all = build.command('all')
      .description('compile all formats')
      .action(function(cmd, args) {});
    var pdf = build.command('pdf')
      .description('compile a pdf file')
      .action(function(cmd, args) {});
    var html =build.command('html')
      .description('compile a html file')
      .action(function(cmd, args) {});
    expect(cli._commands.build).to.be.an
      .instanceof(Command);
    expect(cli._commands.build.action).to.be.a('function');
    expect(cli._commands.build._commands.all).to.be.an
      .instanceof(Command);
    expect(cli._commands.build._commands.all.action).to.be.a('function');
    expect(cli._commands.build._commands.pdf).to.be.an
      .instanceof(Command);
    expect(cli._commands.build._commands.pdf.action).to.be.a('function');
    expect(cli._commands.build._commands.html).to.be.an
      .instanceof(Command);
    expect(cli._commands.build._commands.html.action).to.be.a('function');
    done();
  });
})
