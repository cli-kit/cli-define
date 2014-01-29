var expect = require('chai').expect;
var cli = require('../..')('./package.json');
var option = cli.Option;

describe('cli-define:', function() {
  it('should define arguments by chaining', function(done) {
    cli
      .flag('-v --verbose', 'print more information')
      .flag('-h --help', 'print help')
      .flag('-V --version', 'print program version')
      .command('ls', 'list files')
      .command('rm', 'remove files')
      .command('add', 'create a file')
      .option('-f --file', 'files to modify')
    console.dir(cli);
    done();
  });
})
