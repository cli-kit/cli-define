var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Flag = require('../..').Flag;
var Option = require('../..').Option;

describe('cli-define:', function() {
  it('should define names with whitespace', function(done) {
    cli.option('-v --verbose', 'print more information')
    expect(cli._arguments.verbose.names)
      .to.eql(['-v', '--verbose']);
    expect(cli._arguments.verbose).to.be.an
      .instanceof(Flag);
    done();
  });
  it('should define names with comma', function(done) {
    cli.option('-v, --verbose', 'print more information')
    expect(cli._arguments.verbose.names)
      .to.eql(['-v', '--verbose']);
    expect(cli._arguments.verbose).to.be.an
      .instanceof(Flag);
    done();
  });
  it('should define names with pipe', function(done) {
    cli.option('-v | --verbose', 'print more information')
    expect(cli._arguments.verbose.names)
      .to.eql(['-v', '--verbose']);
    expect(cli._arguments.verbose).to.be.an
      .instanceof(Flag);
    done();
  });
  it('should define names with extra', function(done) {
    cli.option('-f, --float <n>', 'a float argument')
    expect(cli._arguments.float).to.be.an
      .instanceof(Option);
    expect(cli._arguments.float.names)
      .to.eql(['-f', '--float']);
    expect(cli._arguments.float.extra)
      .to.eql('<n>');
    done();
  });
  //.option('-f, --float <n>', 'a float argument', parseFloat)
  //.option('-r, --range <a>..<b>', 'a range', range)
  //.option('-l, --list <items>', 'a list', list)
  //.option('-o, --optional [value]', 'an optional value')
})
