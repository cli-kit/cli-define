var expect = require('chai').expect;
var cli = require('../..')('./package.json');

describe('cli-define:', function() {
  it('should define arguments by chaining', function(done) {
    cli
      .version()
      .help()
      .flag('-v --verbose', 'print more information')
      .command('ls', 'list files')
      .command('rm', 'remove files')
      .command('add', 'create a file')
      .option('-f --file', 'files to modify')
    //console.dir(cli);
    done();
  });
})
