var fs = require('fs');
var path = require('path'), basename = path.basename;
var util = require('util');
var properties = [
  'name',
  'description',
  'key',
  'id',
  'required',
  'value',
  'validator',
  'converter',
  'action'
];

/**
 *  Abstract super class.
 *
 *  @param name The argument name.
 *  @param description The argument description.
 *  @param options The argument options or conversion function.
 */
var Argument = function(name, description, options) {
  if(typeof name == 'object') options = name;
  this._name = name || '';
  this._description = description || '';
  this._key = '';
  this._id = '';
  this._required = false;
  this._value = '';
  this._validator = null;
  this._converter = null;
  this._action = null;
  if(typeof options == 'object' && !Array.isArray(options)) {
    this.initialize(options);
  }else if(typeof options == 'function'){
    this._converter = options;
  }
}

/**
 *  Initialize instance properties.
 *
 *  @param options The argument options.
 */
Argument.prototype.initialize = function(options) {
  for(var z in options) {
    this[z] = options[z];
  }
}

properties.forEach(function(prop) {
  Argument.prototype.__defineGetter__(prop, function() {
    return this['_' + prop];
  });
  Argument.prototype.__defineSetter__(prop, function(value) {
    this['_' + prop] = value;
  });
});

/**
 *  Represents an option argument.
 */
var Option = function() {
  Argument.apply(this, arguments);
}

util.inherits(Option, Argument);

/**
 *  Represents a flag argument.
 */
var Flag = function() {
  Argument.apply(this, arguments);
}

util.inherits(Flag, Argument);

/**
 *  Represents a command argument.
 */
var Command = function() {
  Argument.apply(this, arguments);
  this.commands = {};
  this.arguments = {};
}

util.inherits(Command, Argument);

/**
 *  Define a command argument.
 */
Command.prototype.command = function(name, description, options) {
  this.commands[name] = new Command(name, description, options);
  return this;
}

/**
 *  Define an option argument.
 */
Command.prototype.option = function(name, description, options) {
  var key = name;
  if(name instanceof Option) key = name.key || name.name;
  this.arguments[key] =
    (name instanceof Option) ? name : new Option(name, description, options);
  return this;
}

/**
 *  Define a flag option.
 */
Command.prototype.flag = function(name, description, options) {
  var key = name;
  if(name instanceof Flag) key = name.key || name.name;
  this.arguments[key] =
    (name instanceof Flag) ? name : new Flag(name, description, options);
  return this;
}

/**
 *  Represents the program.
 */
var Program = function() {
  Command.apply(this, arguments);
  this._version = '0.0.1';
  this._author = null;
}

util.inherits(Program, Command);

/**
 *  Adds a version flag to the program.
 *
 *  @param version A specific version number.
 *  @param name The argument name.
 *  @param description The argument description.
 *  @param action A function to invoke.
 */
Program.prototype.version = function(version, name, description, action) {
  if(typeof version == 'function') {
    action = version;
    version = null;
  }
  if(version) this._version = version;
  name = name || '-V --version';
  var flag = new Flag(
    name, description || 'print the program version', {action: action});
  flag.key = 'version';
  this.flag(flag);
  return this;
}

/**
 *  Adds a help flag to the program.
 *
 *  @param name The argument name.
 *  @param description The argument description.
 *  @param action A function to invoke.
 */
Program.prototype.help = function(name, description, action) {
  if(typeof name == 'function') {
    action = name;
    name = null;
  }
  name = name || '-h --help';
  var flag = new Flag(
    name, description || 'print usage information', {action: action});
  flag.key = 'help';
  this.flag(flag);
  return this;
}

var root = new Program(basename(process.argv[1]));
properties.forEach(function(prop) {
  if(prop != 'name' && prop != 'description') delete root['_' + prop];
})

/**
 *  Initialize the root command from a package.json
 *  project descripton.
 *
 *  @param package The path to package.json.
 *  @param name A specific name for the root command (optional).
 *  @param description A specific description for the root command (optional).
 */
function create(package, name, description) {
  if(fs.existsSync(package)) {
    try {
      var pkg = root.package = require(package);
      root._version = pkg.version;
      if(pkg.author) root._author = pkg.author;
      if(pkg.description) root._description = pkg.description;
    }catch(e) {
      console.error('package parse error %s (malformed json)', package);
    }
  }
  if(name) root.name = name;
  if(description) root.description = description;
  return root;
}

root.Command = Command;
root.Option = Option;
root.Flag = Flag;

module.exports = create;
module.exports.cli = root;
