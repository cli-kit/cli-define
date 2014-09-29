var path = require('path');
var expect = require('chai').expect;
var pkgpath = path.join(__dirname, '..', '..', 'package.json')
var pkg = require('../../package.json');
var define = require('../..');

describe('cli-define:', function() {
  it('should define subcommands', function(done) {
    var cli = define(pkgpath, 'mock-program');
    expect(cli.name()).to.eql('mock-program');

    var ls = cli.command('ls, list')
      .description('list packages');
    expect(ls.getLongName()).to.eql('list');
    expect(cli.commands().list).to.equal(ls);
    var deps = ls.command('deps, dependencies')
      .description('list package dependencies')
    expect(deps.getLongName()).to.eql('dependencies');
    expect(ls.commands().dependencies).to.equal(deps);
    var parents = deps.getParents();
    expect(parents[0]).to.equal(ls);
    expect(parents[1]).to.equal(cli);
    parents = deps.getParents(true);
    expect(parents[0]).to.equal(cli);
    expect(parents[1]).to.equal(ls);
    expect(cli.getFullName()).to.eql('mock-program')
    expect(ls.getFullName()).to.eql('mock-program-list')
    expect(deps.getFullName()).to.eql('mock-program-list-dependencies');
    done();
  });
})
