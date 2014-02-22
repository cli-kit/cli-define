var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Option = require('../..').Option;

describe('cli-define:', function() {
  it('should define extra (optional)', function(done) {
    cli.option('-t, --type [type]', 'a mime type')
    expect(cli._options.type.extra()).to.eql('[type]');
    expect(cli._options.type.names()).to.eql(['-t', '--type']);
    done();
  });
  it('should define extra (required)', function(done) {
    cli.option('-t, --type <type>', 'a mime type')
    expect(cli._options.type.extra()).to.eql('<type>');
    expect(cli._options.type.names()).to.eql(['-t', '--type']);
    done();
  });
  it('should define extra (multiple)', function(done) {
    cli.option('-t, --type <type...>', 'a mime type')
    expect(cli._options.type.extra()).to.eql('<type...>');
    expect(cli._options.type.names()).to.eql(['-t', '--type']);
    done();
  });
  it('should define extra (multiple space)', function(done) {
    cli.option('-t, --type <type> ...', 'a mime type')
    expect(cli._options.type.extra()).to.eql('<type> ...');
    expect(cli._options.type.names()).to.eql(['-t', '--type']);
    done();
  });
  it('should define extra (single char)', function(done) {
    cli.option('-f, --float <n>', 'a float')
    expect(cli._options.float.extra()).to.eql('<n>');
    expect(cli._options.float.names()).to.eql(['-f', '--float']);
    done();
  });
  it('should create argument with flush value (bracket)', function(done) {
    cli.option('-a, --another[=VALUE]', 'another option')
    expect(cli._options.another.extra()).to.eql('[=VALUE]');
    expect(cli._options.another.names()).to.eql(['-a', '--another']);
    done();
  });
  it('should create argument with flush value (angle)', function(done) {
    cli.option('-a, --another<=VALUE>', 'another option')
    expect(cli._options.another.extra()).to.eql('<=VALUE>');
    expect(cli._options.another.names()).to.eql(['-a', '--another']);
    done();
  });
  it('should create argument with equals', function(done) {
    cli.option('-a, --another=VALUE', 'another option')
    expect(cli._options.another.extra()).to.eql('=VALUE');
    expect(cli._options.another.names()).to.eql(['-a', '--another']);
    done();
  });
})
