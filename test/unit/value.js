var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Flag = require('../..').Flag;
var Option = require('../..').Option;

describe('cli-define:', function() {
  it('should define default value (string)', function(done) {
    cli.option('-t, --type <type>', 'a mime type', 'application/json')
    expect(cli._arguments.type).to.be.an
      .instanceof(Option);
    expect(cli._arguments.type.value()).to.eql('application/json');
    done();
  });
  it('should define default value (integer)', function(done) {
    cli.option('-p, --port <n>', 'a port number', 8080)
    expect(cli._arguments.port).to.be.an
      .instanceof(Option);
    expect(cli._arguments.port.value()).to.eql(8080);
    done();
  });
  it('should define default value (float)', function(done) {
    cli.option('--pi <n>', 'value of pi', 3.14)
    expect(cli._arguments.pi).to.be.an
      .instanceof(Option);
    expect(cli._arguments.pi.value()).to.eql(3.14);
    done();
  });
  it('should define default value (array)', function(done) {
    cli.option('--list <value>', 'a list', ['x', 'y', 'z'])
    expect(cli._arguments.list).to.be.an
      .instanceof(Option);
    expect(cli._arguments.list.value()).to.eql(['x', 'y', 'z']);
    done();
  });
  it('should define default value (boolean)', function(done) {
    cli.option('--file [value]', 'a list of files', false)
    expect(cli._arguments.file).to.be.an
      .instanceof(Option);
    expect(cli._arguments.file.value()).to.eql(false);
    done();
  });
  it('should define default value/converter', function(done) {
    cli.option('-p, --port <n>', 'a port number', 8080, parseInt)
    expect(cli._arguments.port).to.be.an
      .instanceof(Option);
    expect(cli._arguments.port.value()).to.eql(8080);
    expect(cli._arguments.port.converter()).to.be.a('function')
      .that.equals(parseInt);
    done();
  });
  it('should define converter/default value', function(done) {
    cli.option('-p, --port <n>', 'a port number', parseInt, 8080)
    expect(cli._arguments.port).to.be.an
      .instanceof(Option);
    expect(cli._arguments.port.value()).to.eql(8080);
    expect(cli._arguments.port.converter()).to.be.a('function')
      .that.equals(parseInt);
    done();
  });
})
