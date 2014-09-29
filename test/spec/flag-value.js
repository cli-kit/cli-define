var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Flag = require('../..').Flag;

describe('cli-define:', function() {
  it('should define flag with default value', function(done) {
    cli.option('--color', 'use ansi colors')
    expect(cli._options.color).to.be.an
      .instanceof(Flag);
    expect(cli._options.color.value()).to.eql(undefined);
    done();
  });
  it('should define flag with default value', function(done) {
    cli.option('--no-color', 'do not use ansi colors')
    // NOTE: must have both options for help etc.
    expect(cli._options.color).to.be.an
      .instanceof(Flag);
    expect(cli._options.color.value()).to.eql(undefined);
    expect(cli._options.noColor).to.be.an
      .instanceof(Flag);
    expect(cli._options.noColor.value()).to.eql(undefined);
    done();
  });
})
