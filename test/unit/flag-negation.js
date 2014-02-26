var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Flag = require('../..').Flag;

describe('cli-define:', function() {
  it('should define flag with --[no]color', function(done) {
    cli.option('--[no]color', 'use ansi colors')
    var opt = cli._options.color;
    expect(opt).to.be.an
      .instanceof(Flag);
    expect(opt.value()).to.eql(undefined);
    expect(opt.key()).to.eql('color');
    expect(opt.name()).to.eql('--[no]color');
    expect(opt.names()).to.eql(['--[no]color']);
    expect(opt.getOptionString()).to.eql('--[no]color');
    done();
  });
  it('should define flag with --[no]-color', function(done) {
    cli.option('--[no]-color', 'use ansi colors')
    expect(cli._options.color).to.be.an
      .instanceof(Flag);
    expect(cli._options.color.value()).to.eql(undefined);
    done();
  });
  it('should define flag with --[no-]color', function(done) {
    cli.option('--[no-]color', 'use ansi colors')
    var opt = cli._options.color;
    expect(opt).to.be.an
      .instanceof(Flag);
    expect(opt.value()).to.eql(undefined);
    expect(opt.key()).to.eql('color');
    expect(opt.name()).to.eql('--[no-]color');
    expect(opt.names()).to.eql(['--[no-]color']);
    expect(opt.getOptionString()).to.eql('--[no-]color');
    done();
  });

  it('should define flag with -c, --[no]color (short)', function(done) {
    cli.option('-c, --[no]color', 'use ansi colors')
    var opt = cli._options.color;
    expect(opt).to.be.an
      .instanceof(Flag);
    expect(opt.value()).to.eql(undefined);
    expect(opt.key()).to.eql('color');
    expect(opt.name()).to.eql('-c, --[no]color');
    expect(opt.names()).to.eql(['-c', '--[no]color']);
    expect(opt.getOptionString()).to.eql('-c, --[no]color');
    done();
  });
  it('should define flag with -c, --[no]-color (short after)', function(done) {
    cli.option('--[no]-color, -c', 'use ansi colors')
    var opt = cli._options.color;
    expect(opt).to.be.an
      .instanceof(Flag);
    expect(opt.value()).to.eql(undefined);
    expect(opt.key()).to.eql('color');
    expect(opt.name()).to.eql('--[no]-color, -c');
    expect(opt.names()).to.eql(['--[no]-color', '-c']);
    expect(opt.getOptionString()).to.eql('-c, --[no]-color');
    done();
  });
  it('should define flag with -c, --[no-]color (short)', function(done) {
    cli.option('-c, --[no-]color', 'use ansi colors')
    var opt = cli._options.color;
    expect(opt).to.be.an
      .instanceof(Flag);
    expect(opt.value()).to.eql(undefined);
    expect(opt.key()).to.eql('color');
    expect(opt.name()).to.eql('-c, --[no-]color');
    expect(opt.names()).to.eql(['-c', '--[no-]color']);
    expect(opt.getOptionString()).to.eql('-c, --[no-]color');
    done();
  });
})
