var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));

describe('cli-define:', function() {
  it('should set program version', function(done) {
    var ver = '0.0.1';
    cli.version(ver);
    expect(cli._version).to.eql(ver);
    done();
  });
  it('should set program version with name and description', function(done) {
    var ver = '0.0.1', name = '-v', description = 'print version';
    cli.version(ver, name, description);
    expect(cli._version).to.eql(ver);
    expect(cli._arguments.version._name).to.eql(name);
    expect(cli._arguments.version._description).to.eql(description);
    done();
  });
  it('should set program version as action', function(done) {
    function version(){}
    cli.version(version);
    expect(cli._arguments.version.action()).to.eql(version);
    done();
  });
})
