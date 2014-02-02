var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));

describe('cli-define:', function() {
  it('should define optional value', function(done) {
    cli.option('-t, --type [type]', 'a mime type', 'application/json')
    expect(cli._arguments.type.optional).to.eql(true);
    done();
  });
  it('should define required value', function(done) {
    cli.option('-t, --type <type>', 'a mime type', 'application/json')
    expect(cli._arguments.type.optional).to.eql(false);
    done();
  });
  it('should define required value (single name)', function(done) {
    cli.option('--type <type>', 'a mime type', 'application/json')
    expect(cli._arguments.type.optional).to.eql(false);
    done();
  });
})
