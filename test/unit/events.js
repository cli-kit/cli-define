var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(path.join(__dirname, '..', '..', 'package.json'));
var Option = require('../..').Option;

describe('cli-define:', function() {
  it('should trigger events on program', function(done) {
    cli.setMaxListeners(10);
    cli.addListener('alt', function(){})
    cli.once('event', function() {
      expect(this).to.eql(cli);
      cli.removeAllListeners('alt');
      expect(cli.listeners('alt').length).to.eql(0);
      expect(Object.keys(cli).length).to.eql(0);
      done();
    })
    expect('emit' in cli).to.eql(true);
    cli.emit('event');
  });

  it('should trigger events on option', function(done) {
    var opts = {
      name: '-v, --verbose',
      description: 'verbose option'
    };
    var arg = new Option(opts);
    arg.setMaxListeners(10);
    arg.addListener('alt', function(){})
    arg.once('event', function() {
      expect(this).to.eql(arg);
      arg.removeAllListeners('alt');
      expect(arg.listeners('alt').length).to.eql(0);
      expect(Object.keys(arg).length).to.eql(0);
      done();
    })
    expect('emit' in arg).to.eql(true);
    arg.emit('event');
  });
})
