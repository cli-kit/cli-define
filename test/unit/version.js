var path = require('path');
var expect = require('chai').expect;

describe('cli-define:', function() {
  it('should set program version', function(done) {
    var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
    var ver = '0.0.1';
    cli.version(ver);
    expect(cli.version()).to.eql(ver);
    done();
  });
  it('should set program version with name and description', function(done) {
    var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
    var ver = '0.0.1', name = '-v', description = 'print version';
    cli.version(ver, name, description);
    expect(cli._version).to.eql(ver);
    expect(cli._arguments.version.description()).to.eql(description);
    done();
  });
  it('should set program version as action', function(done) {
    var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
    function version(){}
    cli.version(version);
    expect(cli._arguments.version.action()).to.eql(version);
    done();
  });
})
