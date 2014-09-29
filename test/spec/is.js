var expect = require('chai').expect
  , Argument = require('../..').Argument
  , Program = require('../..').Program
  , Command = require('../..').Command
  , Option = require('../..').Option
  , Flag = require('../..').Flag;

function assert(i) {
  expect(i.isArgument).to.be.a('function');
  expect(i.isOption).to.be.a('function');
  expect(i.isFlag).to.be.a('function');
  expect(i.isCommand).to.be.a('function');
  expect(i.isProgram).to.be.a('function');
}

describe('cli-define:', function() {

  it('should have is functions (argument)', function(done) {
    var arg = new Argument('arg');

    assert(arg);
    expect(arg.isArgument()).to.eql(true);

    expect(arg.isOption()).to.eql(false);
    expect(arg.isFlag()).to.eql(false);
    expect(arg.isProgram()).to.eql(false);
    expect(arg.isCommand()).to.eql(false);
    done();
  });

  it('should have is functions (option)', function(done) {
    var arg = new Option('opt');
    assert(arg);
    expect(arg.isArgument()).to.eql(true);
    expect(arg.isOption()).to.eql(true);

    expect(arg.isFlag()).to.eql(false);
    expect(arg.isProgram()).to.eql(false);
    expect(arg.isCommand()).to.eql(false);
    done();
  });


  it('should have is functions (flag)', function(done) {
    var arg = new Flag('flag');
    assert(arg);
    expect(arg.isArgument()).to.eql(true);
    expect(arg.isFlag()).to.eql(true);

    expect(arg.isOption()).to.eql(false);
    expect(arg.isProgram()).to.eql(false);
    expect(arg.isCommand()).to.eql(false);
    done();
  });

  it('should have is functions (program)', function(done) {
    var arg = new Program('program');
    assert(arg);
    expect(arg.isProgram()).to.eql(true);
    expect(arg.isCommand()).to.eql(true);

    expect(arg.isArgument()).to.eql(false);
    expect(arg.isFlag()).to.eql(false);
    expect(arg.isOption()).to.eql(false);
    done();
  });

  it('should have is functions (command)', function(done) {
    var arg = new Command('command');
    assert(arg);
    expect(arg.isCommand()).to.eql(true);

    expect(arg.isProgram()).to.eql(false);
    expect(arg.isArgument()).to.eql(false);
    expect(arg.isFlag()).to.eql(false);
    expect(arg.isOption()).to.eql(false);
    done();
  });
});
