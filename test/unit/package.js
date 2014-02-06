var path = require('path');
var expect = require('chai').expect;
var pkgpath = path.join(__dirname, '..', '..', 'package.json')
var pkg = require('../../package.json');

describe('cli-define:', function() {
  it('should define package information (module)', function(done) {
    var cli = require('../..')(pkgpath);
    expect(cli.package()).to.be.an('object').to.eql(pkg);
    done();
  });
  it('should define package information (method)', function(done) {
    var cli = require('../..')();
    cli.package(pkgpath);
    expect(cli.package()).to.be.an('object').to.eql(pkg);
    done();
  });
  it('should throw error on missing package descriptor', function(done) {
    var cli = require('../..')();
    function fn() {
      cli.package('unknown-package.json');
    }
    expect(fn).throws(Error);
    done();
  });
})
