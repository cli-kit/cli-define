var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var pkg = require('../../package.json');

describe('cli-define:', function() {
  it('should define package information', function(done) {
    expect(cli._package).to.be.an('object').to.eql(pkg);
    done();
  });
})
