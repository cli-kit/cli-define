var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Flag = require('../..').Flag;

describe('cli-define:', function() {
  it('should define flag with default value', function(done) {
    cli.option('--color', 'use ansi colors')
    expect(cli._arguments.color).to.be.an
      .instanceof(Flag);
    expect(cli._arguments.color.value).to.eql(false);
    done();
  });
  it('should define flag with default value (true)', function(done) {
    cli.option('--no-color', 'do not use ansi colors')
    expect(cli._arguments.color).to.be.an
      .instanceof(Flag);
    expect(cli._arguments.color.value).to.eql(true);
    done();
  });
})
