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
      key: 'mockCommand',
      options: {
        mockFlagOption: {
          name: '--mock-flag-option'
        },
        mockOption: {
          name: '--mock-option <value>',
          key: 'mockOption'
        }
      },
      commands: {
        mockSubCommand: {
          name: 'mock-sub-command',
          key: 'mockSubCommandOverride',
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

    expect(cmd.hasOptions()).to.eql(true);
    expect(cmd.hasCommands()).to.eql(true);

    expect(cmd.options().mockFlagOption).to.be.instanceof(Flag);
    expect(cmd.options().mockOption).to.be.instanceof(Option);
    expect(cmd.commands().mockSubCommandOverride).to.be.instanceof(Command);

    var sub = cmd.commands().mockSubCommandOverride;
    expect(sub.options().mockNestedFlagOption).to.be.instanceof(Flag);
    expect(sub.options().mockNestedOption).to.be.instanceof(Option);
    var deep = sub.commands().mockDeepCommand;
    expect(deep).to.be.instanceof(Command);

    expect(deep.hasOptions()).to.eql(false);
    expect(deep.hasCommands()).to.eql(false);

    done();
  });
})
