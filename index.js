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
 *  @param options The argument options.
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
  this.initialize(options);
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
    this[prop] = value;
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
  this.arguments[name] = new Option(name, description, options);
  return this;
}

/**
 *  Define a flag option.
 */
Command.prototype.flag = function(name, description, options) {
  this.arguments[name] = new Flag(name, description, options);
  return this;
}

var root = new Command(basename(process.argv[1]));
properties.forEach(function(prop) {
  if(prop != 'name') delete root['_' + prop];
})
module.exports = root;
