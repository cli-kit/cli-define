var expect = require('chai').expect;
var cli = require('../..')('./package.json');

describe('cli-define:', function() {
  it('should define names with whitespace', function(done) {
    cli.flag('-v --verbose', 'print more information')
    expect(cli._arguments.verbose.names)
      .to.eql(['-v', '--verbose']);
    done();
  });
  it('should define names with comma', function(done) {
    cli.flag('-v, --verbose', 'print more information')
    expect(cli._arguments.verbose.names)
      .to.eql(['-v', '--verbose']);
    done();
  });
  it('should define names with pipe', function(done) {
    cli.flag('-v | --verbose', 'print more information')
    expect(cli._arguments.verbose.names)
      .to.eql(['-v', '--verbose']);
    done();
  });
  it('should define names with extra', function(done) {
    cli.flag('-f, --float <n>', 'a float argument')
    expect(cli._arguments.float._names)
      .to.eql(['-f', '--float']);
    expect(cli._arguments.float._extra)
      .to.eql('<n>');
    done();
  });

  //.option('-f, --float <n>', 'a float argument', parseFloat)
  //.option('-r, --range <a>..<b>', 'a range', range)
  //.option('-l, --list <items>', 'a list', list)
  //.option('-o, --optional [value]', 'an optional value')
})
