var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Flag = require('../..').Flag;
var Option = require('../..').Option;

describe('cli-define:', function() {
  it('should define option with converter', function(done) {
    cli.option('-f, --float <n>', 'a float argument', parseFloat)
    expect(cli._arguments.float).to.be.an
      .instanceof(Option);
    expect(cli._arguments.float.names)
      .to.eql(['-f', '--float']);
    expect(cli._arguments.float.extra)
      .to.eql('<n>');
    expect(cli._arguments.float.converter)
      .to.be.a('function').that.equals(parseFloat);
    done();
  });
})
