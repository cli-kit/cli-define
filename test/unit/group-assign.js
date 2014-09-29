var path = require('path');
var expect = require('chai').expect;
var cli = require('../..')(
  path.join(__dirname, '..', '..', 'package.json'));
var Option = require('../..').Option;
var Flag = require('../..').Flag;
var Command = require('../..').Command;

describe('cli-define:', function() {

  it('should assign option and command instances', function(done) {
    var opts = {
      name: 'mock-command',
      options: {
        mockFlagOption: {
          name: '--mock-flag-option'
        },
        mockOption: {
          name: '--mock-option <value>'
        }
      },
      commands: {
        mockSubCommand: {
          name: 'mock-sub-command',
          options: {
            mockNestedFlagOption: {
              name: '--mock-nested-flag-option'
            },
            mockNestedOption: {
              name: '--mock-nested-option <value>'
            }
          },
          commands: {
            mockDeepCommand: {
              name: 'mock-deep-command'
            }
          }
        }
      }
    }

    var cmd = new Command(opts);
    expect(cmd.options().mockFlagOption).to.be.instanceof(Flag);
    expect(cmd.options().mockOption).to.be.instanceof(Option);
    expect(cmd.commands().mockSubCommand).to.be.instanceof(Command);

    var sub = cmd.commands().mockSubCommand;
    expect(sub.options().mockNestedFlagOption).to.be.instanceof(Flag);
    expect(sub.options().mockNestedOption).to.be.instanceof(Option);
    expect(sub.commands().mockDeepCommand).to.be.instanceof(Command);

    done();
  });
})
