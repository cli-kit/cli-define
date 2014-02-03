var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Command = require('../..').Command;

describe('cli-define:', function() {
  it('should create command', function(done) {
    var opts = {
      name: 'install',
      description: 'verbose option'
    };
    var arg = new Command(opts);
    expect(arg.name).to.eql(opts.name);
    expect(arg.description()).to.eql(opts.description);
    expect('value' in arg).to.eql(false);
    done();
  });
})
