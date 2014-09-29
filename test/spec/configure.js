var path = require('path');
var expect = require('chai').expect;
var cli = require('../..');

describe('cli-define:', function() {
  it('should configure with name and description', function(done) {
    var name = 'program';
    var description = 'a mock program';
    var program = cli(null, name, description);
    expect(program.name()).to.eql(name);
    expect('' + program.description()).to.eql(description);
    //expect(cli._options.type.optional).to.eql(true);
    done();
  });

  it('should throw error with malformed json', function(done) {
    var pkg = path.join(__dirname, '..', 'package.json')
    function fn(){
      cli(pkg);
    }
    expect(fn).throws(Error);
    done();
  });
})
