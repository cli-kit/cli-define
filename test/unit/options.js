var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Option = require('../..').Option;

describe('cli-define:', function() {
  it('should create argument with options object', function(done) {
    function converter(){}
    function validator(){}
    function action(){console.log('action called.')}
    var opts = {
      name: '-v, --verbose',
      validator: validator,
      description: 'verbose option',
      action: action
    };
    var arg = new Option(opts);
    expect(arg.name).to.eql(opts.name);
    expect(arg.action()).to.eql(action);
    expect(arg.validator).to.eql(validator);

    arg = new Option(opts.name, opts.description, converter, validator);
    expect(arg.converter).to.eql(converter);
    expect(arg.validator).to.eql(validator);
    done();
  });
})