var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(
  path.join(__dirname, '..', '..', 'package.json'));
var Option = require('../..').Option;
var Flag = require('../..').Flag;
var Command = require('../..').Command;

describe('cli-define:', function() {
  it('should assign options to command', function(done) {
    //var cmd = new Command('mock-command');
    var opts = {
      name: 'mock-command',
      options: {
        mockOption: {
          name: 'mock-option'
        }
      }
    }
    var cmd = new Command(opts);
    console.dir(cmd.options());
    done();
  });
})
