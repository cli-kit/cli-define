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

var delimiter = /[ ,|]+/;
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

function define(obj, name, value, writable) {
  writable = writable || false;
  Object.defineProperty(obj, name,
    {
      enumerable: false,
      configurable: false,
      writable: writable,
      value: value
    }
  );
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
  define(this, '_name', name || '', true);
  define(this, '_description', description || '', true);
  define(this, '_key', '', true);
  define(this, '_id', '', true);
  define(this, '_optional', true, true);
  define(this, '_multiple', false, true);
  define(this, '_value', undefined, true);
  define(this, '_converter', undefined, true);
  define(this, '_action', undefined, true);
  define(this, '_extra', undefined, true);
  define(this, '_names', undefined, true);

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

  // private
  define(this, '_commands', {}, true);
  define(this, '_arguments', {}, true);
  define(this, '_name', name || '', true);
  define(this, '_description', description || '', true);
  define(this, '_key', '', true);
  define(this, '_id', '', true);
  define(this, '_action', undefined, true);
  define(this, '_names', undefined, true);

  // public
  define(this, 'args', undefined, true);

  if((typeof options == 'object')) {
    initialize.call(this, options, commands);
  }
  this._names = this._name.split(delimiter);
  this._key = this._names[0];
}

util.inherits(Command, events.EventEmitter);

Command.prototype.__defineGetter__('names', function() {
  return this._names;
});

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
function command(name, description, options) {
  var opt = (name instanceof Command) ? name
    : new Command(name, description, options);
  this._commands[opt.key] = opt;
  return description ? this : opt;
}
define(Command.prototype, 'command', command, false);

/**
 *  Define an option argument.
 */
function option(name, description, options, coerce, value) {
  var clazz = Option;
  if(typeof name == 'string' && !/[<\[]/.test(name)) {
    clazz = Flag;
  }
  var opt = (name instanceof clazz) ? name
    : new clazz(name, description, options, coerce, value);
  this._arguments[opt.key] = opt;
  return this;
}
define(Command.prototype, 'option', option, false);

/**
 *  Define a flag argument explicitly.
 */
function flag(name, description, options, coerce, value) {
  var opt = (name instanceof Flag) ? name
    : new Flag(name, description, options, coerce, value);
  this._arguments[opt.key] = opt;
  return this;
}
define(Command.prototype, 'flag', flag, false);

/**
 *  Represents the program.
 */
var Program = function() {
  Command.apply(this, arguments);
  define(this, '_version', '0.0.1', true);
  define(this, '_author', null, true);
  define(this, '_usage', null, true);
}

util.inherits(Program, Command);

/**
 *  Set the program usage string.
 *
 *  @param usage The program usage string.
 */
function usage(usage) {
  this._usage = usage;
  return this;
}
define(Program.prototype, 'usage', usage, false);

/**
 *  Adds a version flag to the program.
 *
 *  @param version A specific version number.
 *  @param name The argument name.
 *  @param description The argument description.
 *  @param action A function to invoke.
 */
function version(version, name, description, action) {
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
define(Program.prototype, 'version', version, false);

/**
 *  Adds a help flag to the program.
 *
 *  @param name The argument name.
 *  @param description The argument description.
 *  @param action A function to invoke.
 */
function help(name, description, action) {
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
define(Program.prototype, 'help', help, false);

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
