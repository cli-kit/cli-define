var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Option = require('../..').Option;
var Flag = require('../..').Flag;

describe('cli-define:', function() {
  it('should throw type error on invalid name', function(done) {
    function fn() {
      var arg = new Option(false);
    }
    expect(fn).throws(TypeError);
    done();
  });
  it('should create argument with options object', function(done) {
    function converter(){}
    function action(){console.log('action called.')}
    var opts = {
      name: '-v, --verbose',
      description: 'verbose option',
      action: action
    };
    var arg = new Option(opts);
    expect(arg.name()).to.eql(opts.name);
    expect(arg.action()).to.eql(action);

    arg = new Option(opts.name, opts.description, converter);
    expect(arg.converter()).to.eql(converter);
    done();
  });
  it('should ignore unknown option', function(done) {
    var opts = {
      name: '-v, --verbose',
      description: 'verbose option',
      unknown: true
    };
    var arg = new Option(opts);
    expect(arg.name()).to.eql(opts.name);
    expect(arg.unknown).to.eql(undefined);
    done();
  });
  it('should use existing option', function(done) {
    var opts = {
      name: '-v, --verbose',
      description: 'verbose option'
    };
    var arg = new Option(opts);
    cli.option(arg);
    expect(cli._options.verbose.name()).to.eql(opts.name);
    done();
  });
  it('should use existing flag', function(done) {
    var opts = {
      name: '-v, --verbose',
      description: 'verbose option'
    };
    var arg = new Flag(opts);
    cli.flag(arg);
    expect(cli._options.verbose.name()).to.eql(opts.name);
    done();
  });
  it('should explicitly add a flag', function(done) {
    cli
      .flag('-v --verbose', 'print more information')
    expect(cli._options.verbose).to.be.an
      .instanceof(Flag);
    done();
  });
  it('should throw error on invalid name', function(done) {
    function fn() {
      cli
        .flag('', 'invalid option')
    }
    expect(fn).throws(Error);
    done();
  });
  it('should create argument with flush value (bracket)', function(done) {
    var opts = {
      name: '-a, --another-option[=VALUE]',
      description: 'another option',
    };
    var arg = new Option(opts);
    expect(arg.name()).to.eql(opts.name);
    expect(arg.names()).to.eql(['-a', '--another-option']);
    expect(arg.extra()).to.eql('[=VALUE]')
    done();
  });
  it('should create argument with flush value (angle)', function(done) {
    var opts = {
      name: '-a, --another-option<=VALUE>',
      description: 'another option',
    };
    var arg = new Option(opts);
    expect(arg.name()).to.eql(opts.name);
    expect(arg.names()).to.eql(['-a', '--another-option']);
    expect(arg.extra()).to.eql('<=VALUE>')
    done();
  });
})
