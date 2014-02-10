var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Command = require('../..').Command;

describe('cli-define:', function() {
  it('should create command', function(done) {
    var opts = {
      name: 'install, ins, i',
      description: 'verbose option'
    };
    var arg = new Command(opts);
    expect(arg.name()).to.eql(opts.name);
    expect(arg.description()).to.eql(opts.description);
    expect('value' in arg).to.eql(false);
    done();
  });
  it('should coerce command (toString)', function(done) {
    var opts = {
      name: 'install, ins, i',
      description: 'verbose option'
    };
    var arg = new Command(opts);
    var s = arg.toString();
    expect(s).to.eql('[object Object]');
    s = arg.toString(null);
    expect(s).to.eql('install | ins | i');
    s = arg.toString(', ');
    expect(s).to.eql('install, ins, i');
    done();
  });
  it('should define command names (aliases)', function(done) {
    cli
      .command('install i', 'install packages')
    var cmd = cli._commands.install;
    expect(cmd).to.be.an
      .instanceof(Command);
    expect(cmd.key()).to.eql('install');
    expect(cmd.name()).to.eql('install i');
    expect(cmd.names()).to.eql(['install', 'i']);
    done();
  });

  it('should not enumerate builtin properties and methods', function(done) {
    cli
      .command('install i', 'install packages')
    var cmd = cli._commands.install;
    expect(cmd).to.be.an
      .instanceof(Command);
    expect(Object.keys(cmd).length).to.eql(0);
    var enumerated = [];
    for(var z in cmd) {
      enumerated.push(z);
    }
    expect(enumerated.length).to.eql(0);
    done();
  });

  it('should trigger event', function(done) {
    cli.once('event', function() {
      var enumerated = [];
      expect(Object.keys(cli).length).to.eql(0);
      for(var z in cli) {
        enumerated.push(z);
      }
      expect(enumerated.length).to.eql(0);
      done();
    })
    cli.emit('event');
  });
})
