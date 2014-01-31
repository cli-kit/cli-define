var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Flag = require('../..').Flag;
var Option = require('../..').Option;

describe('cli-define:', function() {
  it('should set program usage', function(done) {
    var usage = '[options] <file...>';
    cli.usage(usage);
    expect(cli._usage).to.eql(usage);
    done();
  });
})
