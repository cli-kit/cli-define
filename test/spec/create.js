var expect = require('chai').expect
  , Argument = require('../..').Argument
  , Program = require('../..').Program
  , Command = require('../..').Command
  , Option = require('../..').Option
  , Flag = require('../..').Flag;

function assert(i) {
  expect(i.createOption).to.be.a('function');
  expect(i.createFlag).to.be.a('function');
  expect(i.createCommand).to.be.a('function');

  expect(i.createCommand('cmd')).to.be.instanceof(Command);
  expect(i.createOption('opt')).to.be.instanceof(Option);
  expect(i.createFlag('flag')).to.be.instanceof(Flag);
}

describe('cli-define:', function() {

  it('should have create functions (program)', function(done) {
    var arg = new Program('program');
    assert(arg);
    done();
  });

  it('should have create functions (command)', function(done) {
    var arg = new Command('command');
    assert(arg);
    done();
  });
});
