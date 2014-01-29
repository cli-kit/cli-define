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
  'converter'
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
    return this[prop];
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
  this.arguments[name] =
    (name instanceof Option) ? name : new Option(name, description, options);
  return this;
}

/**
 *  Define a flag option.
 */
Command.prototype.flag = function(name, description, options) {
  this.arguments[name] =
    (name instanceof Flag) ? name : new Flag(name, description, options);
  return this;
}

var root = new Command(basename(process.argv[1]));
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
      root.version = pkg.version;
      if(pkg.author) root.author = pkg.author;
      if(pkg.description) root.description = pkg.description;
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
