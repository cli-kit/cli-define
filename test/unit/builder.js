var expect = require('chai').expect;
var cli = require('../..');

describe('cli-define:', function() {
  it('should define arguments by chaining', function(done) {
    cli
      .flag('-v --verbose', 'print more information')
      .command('ls', 'list files')
      .command('rm', 'remove files')
      .command('add', 'create a file')
    console.dir(cli);
    done();
  });
})
