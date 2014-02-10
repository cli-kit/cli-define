var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Flag = require('../..').Flag;
var Option = require('../..').Option;

describe('cli-define:', function() {
  it('should define option with converter', function(done) {
    cli.option('-f, --float <n>', 'a float argument', parseFloat)
    expect(cli._options.float).to.be.an
      .instanceof(Option);
    expect(cli._options.float.names())
      .to.eql(['-f', '--float']);
    expect(cli._options.float.extra())
      .to.eql('<n>');
    expect(cli._options.float.converter())
      .to.be.a('function').that.equals(parseFloat);
    done();
  });
  it('should define option with converter (JSON)', function(done) {
    cli.option('-j, --json <j>', 'a json argument', JSON)
    expect(cli._options.json.converter())
      .to.be.an('object').that.equals(JSON);
    done();
  });
  it('should define option with converter array ([JSON])', function(done) {
    var json = [JSON];
    cli.option('-j, --json <j>', 'a json argument', json)
    expect(cli._options.json.converter())
      .to.be.an('array').that.equals(json);
    done();
  });
  it('should define converter with function array ([Number,String, Boolean])',
    function(done) {
      var converters = [Number,String,Boolean];
      cli.option('-c, --coerce <c>', 'a converter argument', converters)
      expect(cli._options.coerce.converter())
        .to.be.an('array').that.equals(converters);
      done();
    }
  );
  it('should define converter on program', function(done) {
    function converter(){};
    var result = cli.converter(converter);
    expect(result).to.equal(cli);
    expect(cli.converter()).to.equal(converter);
    done();
  });
})
