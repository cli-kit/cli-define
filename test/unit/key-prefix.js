process.env.CLI_TOOLKIT_DEBUG=true;
var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Option = require('../..').Option;

describe('cli-define:', function() {
  it('should define flag with key prefix', function(done) {
    cli.option('verbose: -v', 'a verbose option')
    expect(cli._options.verbose.name()).to.eql('-v');
    expect(cli._options.verbose.names()).to.eql(['-v']);
    done();
  });
  it('should define key prefix with whitespace before colon', function(done) {
    cli.option('verbose  : -v', 'a verbose option')
    expect(cli._options.verbose.name()).to.eql('-v');
    expect(cli._options.verbose.names()).to.eql(['-v']);
    done();
  });
  it('should use uppercase key prefix', function(done) {
    cli.option('VERBOSE: -v', 'a verbose option')
    expect(cli._options.VERBOSE.name()).to.eql('-v');
    expect(cli._options.VERBOSE.names()).to.eql(['-v']);
    done();
  });
  it('should use hyphenated key prefix', function(done) {
    cli.option('-verbose-option: -v', 'a verbose option')
    expect(cli._options['-verbose-option'].name()).to.eql('-v');
    expect(cli._options['-verbose-option'].names()).to.eql(['-v']);
    done();
  });
  it('should define option with key prefix', function(done) {
    cli.option('mime: -t, --type [type]', 'a mime type')
    expect(cli._options.mime.name()).to.eql('-t, --type [type]');
    expect(cli._options.mime.extra()).to.eql('[type]');
    expect(cli._options.mime.names()).to.eql(['-t', '--type']);
    done();
  });
  it('should define command with key prefix', function(done) {
    cli.command('configuration: config, conf', 'a configuration command')
    expect(cli._commands.configuration.name()).to.eql('config, conf');
    expect(cli._commands.configuration.names()).to.eql(['config', 'conf']);
    done();
  });
})
