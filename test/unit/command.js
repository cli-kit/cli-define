var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Command = require('../..').Command;

describe('cli-define:', function() {
  it('should create command', function(done) {
    var opts = {
      name: 'install',
      description: 'verbose option'
    };
    var arg = new Command(opts);
    expect(arg.name).to.eql(opts.name);
    expect(arg.description()).to.eql(opts.description);
    expect('value' in arg).to.eql(false);
    done();
  });
  it('should define command names (aliases)', function(done) {
    cli
      .command('install i', 'install packages')
    var cmd = cli._commands.install;
    expect(cmd).to.be.an
      .instanceof(Command);
    expect(cmd.key).to.eql('install');
    expect(cmd.name).to.eql('install i');
    expect(cmd.names).to.eql(['install', 'i']);
    done();
  });

  it('should not enumerate builtin properties and methods', function(done) {
    cli
      .command('install i', 'install packages')
    var cmd = cli._commands.install;
    expect(cmd).to.be.an
      .instanceof(Command);
    console.dir(Object.keys(cmd));
    for(var z in cmd) {
      console.log('cmd %s', z);
    }
    done();
  });

  it('should trigger event', function(done) {
    cli.once('event', function() {

    console.dir(Object.keys(cli));
    for(var z in cli) {
      console.log('cli %s', z);
    }
      done();
    })
    cli.emit('event');
  });
})
