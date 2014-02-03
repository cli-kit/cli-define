var events = require('events');
var fs = require('fs');
var path = require('path'), basename = path.basename;
var util = require('util');
var camelcase = require('cli-util').camelcase;
var commands = [
  'name',
  'key',
  'id'
]

var properties = commands.concat([
  'optional',
  'multiple',
  'value',
  'converter',
  'extra'
]);

var methods = ['description', 'action'];
var required = /^</;
var multiple = /\.\.\./;

function initialize(options, properties) {
  for(var z in options) {
    if(~properties.indexOf(z)) this[z] = options[z];
  }
  if(options.description) this._description = options.description;
  if(options.action) this._action = options.action;
}

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
  this._optional = true;
  this._multiple = false;
  this._value;
  this._converter = null;
  this._action = null;
  this._extra = '';
  if(options === JSON) {
    this._converter = JSON;
  }else if(options && (typeof options == 'object') && !Array.isArray(options)) {
    initialize.call(this, options, properties);
  }else if((typeof options == 'function') || this.isFunctionArray(options)){
    this._converter = options;
    if(arguments.length > 3 && this._value === undefined) {
      this._value = arguments[3];
    }
  }else {
    this._value = options;
    if(arguments.length > 3
      && (typeof(arguments[3]) == 'function'
      || this.isFunctionArray(options))) {
      this._converter = arguments[3];
    }
  }
  var delimiter = /[ ,|]+/;
  this._names = this._name.split(delimiter);
  for(var i = 0;i < this._names.length;i++) {
    if(/^(\[|<)/.test(this._names[i])) {
      this._extra = this._names.slice(i).join(' ');
      this._names = this._names.slice(0, i);
      break;
    }
  }
  if(required.test(this._extra)) {
    this._optional = false;
  }
  if(multiple.test(this._extra)) {
    this._multiple = true;
  }
  this._key = this.getKey();
}

util.inherits(Argument, events.EventEmitter);

/**
 *  Determines whether an array consists solely of functions
 *  allowing for the special case JSON.
 *
 *  @param arr The array candidate.
 */
Argument.prototype.isFunctionArray = function(arr) {
  if(!Array.isArray(arr)) return false;
  var i, item;
  for(i = 0;i < arr.length;i++) {
    item = arr[i];
    if(item !== JSON && !(typeof item == 'function')) return false;
  }
  return true;
}

/**
 *  Retrieve the key for the option.
 */
Argument.prototype.getKey = function() {
  var k, i, v;
  for(i = 0;i < this._names.length;i++) {
    v = this._names[i];
    k = camelcase(v.replace(/^-+/, ''));
    if(/^--[^-]/.test(v)) {
      return k;
    }
  }
  return k;
}

Argument.prototype.action = function() {
  return this._action;
}

Argument.prototype.__defineGetter__('names', function() {
  return this._names;
});

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
  this._value = false;
}

util.inherits(Flag, Argument);

/**
 *  Represents a command argument.
 */
var Command = function(name, description, options) {
  if(typeof name == 'object') options = name;
  this._commands = {};
  this._arguments = {};
  this.args = null;
  this._name = name || '';
  this._description = description || '';
  this._key = '';
  this._id = '';
  this._action = null;
  if((typeof options == 'object')) {
    initialize.call(this, options, commands);
  }
  this._key = this.name;
}

util.inherits(Command, Object);

commands.forEach(function(prop) {
  Command.prototype.__defineGetter__(prop, function() {
    return this['_' + prop];
  });
  Command.prototype.__defineSetter__(prop, function(value) {
    this['_' + prop] = value;
  });
});

methods.forEach(function(prop) {
  Command.prototype[prop] = function(value) {
    var key = '_' + prop;
    if(value === undefined) return this[key];
    this[key] = value;
    return this;
  }
});

/**
 *  Define a command argument.
 */
Command.prototype.command = function(name, description, options) {
  var opt = (name instanceof Command) ? name
    : new Command(name, description, options);
  this._commands[opt.key] = opt;
  return description ? this : opt;
}

/**
 *  Define an option argument.
 */
Command.prototype.option = function(name, description, options, coerce, value) {
  var clazz = Option;
  if(typeof name == 'string' && !/[<\[]/.test(name)) {
    clazz = Flag;
  }
  var opt = (name instanceof clazz) ? name
    : new clazz(name, description, options, coerce, value);
  this._arguments[opt.key] = opt;
  return this;
}

/**
 *  Define a flag argument.
 */
Command.prototype.flag = function(name, description, options, coerce, value) {
  var opt = (name instanceof Flag) ? name
    : new Flag(name, description, options, coerce, value);
  this._arguments[opt.key] = opt;
  return this;
}

/**
 *  Represents the program.
 */
var Program = function() {
  Command.apply(this, arguments);
  this._version = '0.0.1';
  this._author = null;
  this._usage = null;
}

util.inherits(Program, Command);

/**
 *  Set the program usage string.
 *
 *  @param usage Program usage.
 */
Program.prototype.usage = function(usage) {
  this._usage = usage;
  return this;
}

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

/**
 *  Initialize the root command from a package.json
 *  project descripton.
 *
 *  @param package The path to package.json.
 *  @param name A specific name for the root command (optional).
 *  @param description A specific description for the root command (optional).
 */
function create(package, name, description) {
  var root = new Program(basename(process.argv[1]));
  properties.forEach(function(prop) {
    if(prop != 'name' && prop != 'description') delete root['_' + prop];
  })
  if(fs.existsSync(package)) {
    try {
      var pkg = root._package = require(package);
      root._version = pkg.version;
      if(pkg.author) root._author = pkg.author;
      if(pkg.description) root._description = pkg.description;
    }catch(e) {
      throw new Error(util.format(
        'package parse error %s (malformed json)', package));
    }
  }
  if(name) root.name = name;
  if(description) root.description = description;
  return root;
}

module.exports = create;
module.exports.Program = Program;
module.exports.Command = Command;
module.exports.Option = Option;
module.exports.Flag = Flag;
