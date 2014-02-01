var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));

describe('cli-define:', function() {
  it('should define multiple optional value', function(done) {
    cli.option('-f, --file [file...]', 'a file list')
    expect(cli._arguments.file.multiple).to.eql(true);
    done();
  });
  it('should define multiple required value', function(done) {
    cli.option('-f, --file <file...>', 'a file list')
    expect(cli._arguments.file.multiple).to.eql(true);
    expect(cli._arguments.file.optional).to.eql(false);
    done();
  });
})
