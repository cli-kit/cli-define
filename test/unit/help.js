var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));

describe('cli-define:', function() {
  it('should set program help as action', function(done) {
    function help(){}
    cli.help(help);
    expect(cli._arguments.help.action()).to.eql(help);
    done();
  });
})
