var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Option = require('../..').Option;

describe('cli-define:', function() {
  it('should create argument with options object', function(done) {
    function converter(){}
    function action(){console.log('action called.')}
    var opts = {
      name: '-v, --verbose',
      description: 'verbose option',
      action: action
    };
    var arg = new Option(opts);
    expect(arg.name()).to.eql(opts.name);
    expect(arg.action()).to.eql(action);

    arg = new Option(opts.name, opts.description, converter);
    expect(arg.converter()).to.eql(converter);
    done();
  });
})
