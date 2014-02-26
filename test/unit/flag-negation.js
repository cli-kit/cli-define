var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Flag = require('../..').Flag;

describe('cli-define:', function() {
  it('should define flag with --[no]color', function(done) {
    cli.option('--[no]color', 'use ansi colors')
    expect(cli._options.color).to.be.an
      .instanceof(Flag);
    expect(cli._options.color.value()).to.eql(undefined);
    done();
  });
  it('should define flag with --[no]-color', function(done) {
    cli.option('--[no]-color', 'use ansi colors')
    expect(cli._options.color).to.be.an
      .instanceof(Flag);
    expect(cli._options.color.value()).to.eql(undefined);
    done();
  });
  it('should define flag with --[no-]color', function(done) {
    cli.option('--[no-]color', 'use ansi colors')
    expect(cli._options.color).to.be.an
      .instanceof(Flag);
    expect(cli._options.color.value()).to.eql(undefined);
    done();
  });

  it('should define flag with -c, --[no]color (short)', function(done) {
    cli.option('-c, --[no]color', 'use ansi colors')
    expect(cli._options.color).to.be.an
      .instanceof(Flag);
    expect(cli._options.color.value()).to.eql(undefined);
    done();
  });
  it('should define flag with -c, --[no]-color (short)', function(done) {
    cli.option('-c, --[no]-color', 'use ansi colors')
    expect(cli._options.color).to.be.an
      .instanceof(Flag);
    expect(cli._options.color.value()).to.eql(undefined);
    done();
  });
  it('should define flag with -c, --[no-]color (short)', function(done) {
    cli.option('-c, --[no-]color', 'use ansi colors')
    expect(cli._options.color).to.be.an
      .instanceof(Flag);
    expect(cli._options.color.value()).to.eql(undefined);
    done();
  });
})
