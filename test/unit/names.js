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
})
