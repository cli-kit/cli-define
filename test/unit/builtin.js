var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Flag = require('../..').Flag;
var Option = require('../..').Option;
var Command = require('../..').Command;

describe('cli-define:', function() {
  it('should define version flag', function(done) {
    cli.version();
    expect(cli._arguments.version).to.be.an
      .instanceof(Flag);
    done();
  });
  it('should define version flag with name', function(done) {
    cli.version(null, '-v, --version');
    expect(cli._arguments.version).to.be.an
      .instanceof(Flag);
    expect(cli._arguments.version.name).to.eql('-v, --version');
    expect(cli._arguments.version.names).to.eql(['-v', '--version']);
    done();
  });
  it('should define help flag', function(done) {
    cli.help();
    expect(cli._arguments.help).to.be.an
      .instanceof(Flag);
    done();
  });
})
