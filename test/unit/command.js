var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Command = require('../..').Command;

/**
 *  Utility to remove a module from the cache.
 */
function cache(id) {
  for(var z in require.cache) {
    if(z === id) {
      delete require.cache[z];
      break;
    }
  }
}

describe('cli-define:', function() {
  it('should throw type error on invalid name', function(done) {
    function fn() {
      var arg = new Command(false);
    }
    expect(fn).throws(TypeError);
    done();
  });
  it('should create command', function(done) {
    var opts = {
      name: 'install, ins, i',
      description: 'install packages'
    };
    var arg = new Command(opts);
    expect(arg.name()).to.eql(opts.name);
    expect('' + arg.description()).to.eql(opts.description);
    expect('value' in arg).to.eql(false);
    done();
  });
  it('should coerce command (toString)', function(done) {
    var opts = {
      name: 'install, ins, i',
      description: 'install packages'
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
  it('should use existing command', function(done) {
    var opts = {
      name: 'install, ins, i',
      description: 'install packages'
    };
    var arg = new Command(opts);
    cli.command(arg);
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
  it('should enumerate (CLI_TOOLKIT_DEBUG)', function(done) {
    var id = path.normalize(path.join(__dirname, '..', '..', 'index.js'));
    cache(id);
    process.env.CLI_TOOLKIT_DEBUG = true;
    var cli = require('../..')();
    cli.command('install i', 'install packages')
    var cmd = cli._commands.install;
    var enumerated = [];
    for(var z in cmd) {
      enumerated.push(z);
    }
    expect(!!~enumerated.indexOf('command')).to.eql(true);
    delete process.env.CLI_TOOLKIT_DEBUG;
    cache(id);
    done();
  });
})
