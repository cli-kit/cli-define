var path = require('path');
var expect = require('chai').expect;
var pkgpath = path.join(__dirname, '..', '..', 'package.json')
var pkg = require('../../package.json');
var define = require('../..');

describe('cli-define:', function() {
  it('should define subcommands', function(done) {
    var name = 'mock-program'
      , semver = '1.0.0'
      , usage = '<args> <cmd>'
      , description = 'Mock program description.'
      , detail = 'Mock program detail.';

    var cli = define(pkgpath, name, description);
    expect(cli.name()).to.eql(name);

    cli.version(semver);
    expect(cli.version()).to.eql(semver)

    expect(cli.description().txt).to.eql(description);

    cli.detail(detail);
    expect(cli.detail().txt).to.eql(detail);

    cli.usage(usage);
    expect(cli.usage()).to.eql(usage);

    var ls = cli.command('ls, list')
      .description('list packages');
    expect(ls.getLongName()).to.eql('list');
    expect(cli.commands().list).to.equal(ls);
    var deps = ls.command('deps, dependencies')
      .description('list package dependencies')
    expect(deps.getLongName()).to.eql('dependencies');
    expect(deps.getShortName()).to.eql('deps');
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


    // assign to program: no arg and no stash
    cli.assign(null, 'mockProgramOption', '/mock/file/program/assign');

    expect(cli.mockProgramOption).to.eql('/mock/file/program/assign');

    cli.configure({stash: {}});

    // assign to stash no arg
    cli.assign(null, 'mockOption', '/mock/file/stash/assign');

    expect(cli.configure().stash.mockOption).to.eql('/mock/file/stash/assign');

    // assign to stash and arg
    var opt = cli.createOption('--mock-option <value>', 'Mock option');
    cli.option(opt);
    cli.assign(opt, opt.key(), '/mock/file');

    expect(cli.configure().stash.mockOption)
      .to.eql(opt.value())
      .to.eql('/mock/file');

    done();
  });
})
