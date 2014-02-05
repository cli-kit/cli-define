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
    expect(cli._arguments.float.names())
      .to.eql(['-f', '--float']);
    expect(cli._arguments.float.extra())
      .to.eql('<n>');
    expect(cli._arguments.float.converter())
      .to.be.a('function').that.equals(parseFloat);
    done();
  });
  it('should define option with converter (JSON)', function(done) {
    cli.option('-j, --json <j>', 'a json argument', JSON)
    expect(cli._arguments.json.converter())
      .to.be.an('object').that.equals(JSON);
    done();
  });
  it('should define option with converter array ([JSON])', function(done) {
    var json = [JSON];
    cli.option('-j, --json <j>', 'a json argument', json)
    expect(cli._arguments.json.converter())
      .to.be.an('array').that.equals(json);
    done();
  });
  it('should define converter with function array ([Number,String, Boolean])',
    function(done) {
      var converters = [Number,String,Boolean];
      cli.option('-c, --coerce <c>', 'a converter argument', converters)
      expect(cli._arguments.coerce.converter())
        .to.be.an('array').that.equals(converters);
      done();
    }
  );
})
