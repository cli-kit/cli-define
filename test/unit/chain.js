var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Flag = require('../..').Flag;
var Option = require('../..').Option;
var Command = require('../..').Command;

describe('cli-define:', function() {
  it('should define executable commands', function(done) {
    cli
      .version()
      .help()
      .option('-v --verbose', 'print more information')
      .command('ls', 'list files')
      .command('rm', 'remove files')
      .command('add', 'create a file')
      .option('-f --file <file>', 'files to modify')
      .command('print')
        .description('print command line arguments')
        .action(function() {
          console.log(cli._name + ' %s', cli._args.raw.join(' '));
      })
    expect(cli.description).to.be.a('function');
    expect(cli.action).to.be.a('function');
    expect(cli._arguments.version).to.be.an
      .instanceof(Flag);
    expect(cli._arguments.file).to.be.an
      .instanceof(Option);
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
      .option('-v --verbose', 'print more information')
      .command('ls', 'list files')
      .command('rm', 'remove files')
      .command('add', 'create a file')
      .option('-f --file <file>', 'files to modify')
      .command('print')
        .description('print command line arguments')
        .action(function() {
          console.log(cli._name + ' %s', cli._args.raw.join(' '));
      })
    expect(cli.description).to.be.a('function');
    expect(cli.action).to.be.a('function');
    expect(cli._arguments.version).to.be.an
      .instanceof(Flag);
    expect(cli._arguments.file).to.be.an
      .instanceof(Option);
    expect(cli._commands.ls).to.be.an
      .instanceof(Command);
    expect(cli._commands.rm).to.be.an
      .instanceof(Command);
    expect(cli._commands.add).to.be.an
      .instanceof(Command);
    done();
  });
})
