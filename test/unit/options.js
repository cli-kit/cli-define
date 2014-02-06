var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Option = require('../..').Option;
var Flag = require('../..').Flag;

describe('cli-define:', function() {
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
  it('should explicitly add a flag', function(done) {
    cli
      .flag('-v --verbose', 'print more information')
    expect(cli._arguments.verbose).to.be.an
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
})
