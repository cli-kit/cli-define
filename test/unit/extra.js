var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));

describe('cli-define:', function() {
  it('should define extra (optional)', function(done) {
    cli.option('-t, --type [type]', 'a mime type')
    expect(cli._arguments.type.extra()).to.eql('[type]');
    done();
  });
  it('should define extra (required)', function(done) {
    cli.option('-t, --type <type>', 'a mime type')
    expect(cli._arguments.type.extra()).to.eql('<type>');
    done();
  });
  it('should define extra (multiple)', function(done) {
    cli.option('-t, --type <type...>', 'a mime type')
    expect(cli._arguments.type.extra()).to.eql('<type...>');
    done();
  });
  it('should define extra (multiple space)', function(done) {
    cli.option('-t, --type <type> ...', 'a mime type')
    expect(cli._arguments.type.extra()).to.eql('<type> ...');
    done();
  });
})
