var events = require('events');
var fs = require('fs');
var path = require('path'), basename = path.basename;
var util = require('util');
var camelcase = require('cli-util').camelcase;

var mutators = {
  cmd: {
    commands: false,
    arguments: false,
    names: false,
    key: true,
    name: true,
    id: true,
    description: true,
    action: true
  },
  arg: {
    names: false,
    key: true,
    name: true,
    id: true,
    optional: true,
    multiple: true,
    value: true,
    converter: true,
    extra: true,
    description: true,
    action: true
  },
  prg: {
    converter: true
  }
}

var k, keys;
var delimiter = /[ ,|]+/;
var required = /^</;
var multiple = /\.\.\./;

function initialize(options, properties) {
  for(var z in options) {
    if(~properties.indexOf(z) && options[z]) this[z](options[z]);
  }
}

/**
 *  Retrieve the key for an option.
 *
 *  Scope is the option. Alternatively you may pass a
 *  string of the raw name passed when instantiating the options.
 *
 *  @param names Array of names or raw string name (optional).
 */
function getKey(names) {
  var k, names = names || this._names;
  var name = this._name;
  if(typeof names == 'string') {
    name = names;
    names = names.split(delimiter);
  }
  if(!names.length || !names[0]) {
    throw new Error('Invalid option name \'' + name + '\'');
  }

  var k = names.reduce(
    function (a, b) { return a.length > b.length ? a : b; });
  k = k.replace(/^-+/, '');
  return camelcase(k.toLowerCase());
}


var EventProxy = {
  setMaxListeners: function() {
    return this._emitter.setMaxListeners.apply(this, arguments);
  },
  emit: function() {
    return this._emitter.emit.apply(this, arguments);
  },
  addListener: function() {
    return this._emitter.addListener.apply(this, arguments);
  },
  on: function() {
    return this._emitter.on.apply(this, arguments);
  },
  once: function() {
    return this._emitter.once.apply(this, arguments);
  },
  removeListener: function() {
    return this._emitter.removeListener.apply(this, arguments);
  },
  removeAllListeners: function() {
    return this._emitter.removeAllListeners.apply(this, arguments);
  },
  listeners: function() {
    return this._emitter.listeners.apply(this, arguments);
  }
}

var enumerable = process.env.CLI_TOOLKIT_DEBUG ? true : false;

function define(obj, name, value, writable) {
  writable = writable || false;
  Object.defineProperty(obj, name,
    {
      enumerable: enumerable,
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

  // event emitter
  define(this, '_emitter', new events.EventEmitter(), false);
  define(this, '_events', undefined, true);
  define(this, '_maxListeners', undefined, true);
  define(this, 'domain', undefined, true);

  if(options === JSON) {
    this._converter = JSON;
  }else if(options && (typeof options == 'object') && !Array.isArray(options)) {
    initialize.call(this, options, Object.keys(mutators.arg));
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
  this._key = getKey.call(this);
}

for(k in EventProxy) {
  define(Argument.prototype, k, EventProxy[k], false);
}

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

keys = Object.keys(mutators.arg);
keys.forEach(function(name) {
  var read = function() {
    return this['_' + name];
  }
  var write = function(value) {
    var key = '_' + name;
    if(!arguments.length) return this[key];
    this[key] = value;
    return this;
  }
  define(Argument.prototype, name, mutators.arg[name] ? write : read, false);
})

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
  //console.log('Flag %s %s', this._name, this._description);
  this._value = false;
}

util.inherits(Flag, Argument);

/**
 *  Represents a command argument.
 */
var Command = function(name, description, options) {
  //events.EventEmitter.call(this);
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
  define(this, '_package', undefined, true);

  // event emitter
  define(this, '_emitter', new events.EventEmitter(), false);
  define(this, '_events', undefined, true);
  define(this, '_maxListeners', undefined, true);
  define(this, 'domain', undefined, true);

  // public
  define(this, 'args', undefined, true);

  if((typeof options == 'object')) {
    initialize.call(this, options, Object.keys(mutators.cmd));
  }
  this._names = this._name.split(delimiter);
  this._key = getKey.call(this);
}

for(k in EventProxy) {
  define(Command.prototype, k, EventProxy[k], false);
}

keys = Object.keys(mutators.cmd);
keys.forEach(function(name) {
  var read = function() {
    return this['_' + name];
  }
  var write = function(value) {
    var key = '_' + name;
    if(value === undefined) return this[key];
    this[key] = value;
    return this;
  }
  define(Command.prototype, name, mutators.cmd[name] ? write : read, false);
})

/**
 *  Define a command argument.
 */
function command(name, description, options) {
  var opt = (name instanceof Command) ? name
    : new Command(name, description, options);
  this._commands[opt.key()] = opt;
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
  this._arguments[opt.key()] = opt;
  return this;
}
define(Command.prototype, 'option', option, false);

/**
 *  Define a flag argument explicitly.
 */
function flag(name, description, options, coerce, value) {
  var opt = (name instanceof Flag) ? name
    : new Flag(name, description, options, coerce, value);
  this._arguments[opt.key()] = opt;
  return this;
}
define(Command.prototype, 'flag', flag, false);

/**
 *  Represents the program.
 */
var Program = function() {
  Command.apply(this, arguments);
  define(this, '_version', '0.0.1', true);
  define(this, '_package', undefined, true);
  define(this, '_converter', undefined, true);
  define(this, '_author', undefined, true);
  define(this, '_usage', undefined, true);
}

util.inherits(Program, Command);

keys = Object.keys(mutators.prg);
keys.forEach(function(name) {
  var write = function(value) {
    var key = '_' + name;
    if(!arguments.length) return this[key];
    this[key] = value;
    return this;
  }
  define(Program.prototype, name, write, false);
})

/**
 *  Set the program package descriptor.
 *
 *  @param path The path to the package descriptor.
 */
function package(path) {
  if(!arguments.length && this._package) return this._package;
  if(path && fs.existsSync(path)) {
    try {
      var pkg = this._package = require(path);
      this._version = pkg.version;
      if(pkg.author) this._author = pkg.author;
      if(pkg.description) this._description = pkg.description;
    }catch(e) {
      throw new Error(util.format(
        'package parse error %s (malformed json)', path));
    }
  }else if(path) {
    throw new Error(util.format(
      'package descriptor %s does not exist', path));
  }
  return this;
}
define(Program.prototype, 'package', package, false);

/**
 *  Set the program usage string.
 *
 *  @param usage The program usage string.
 */
function usage(usage) {
  if(!arguments.length && this._usage) return this._usage;
  this._usage = usage;
  return this;
}
define(Program.prototype, 'usage', usage, false);

/**
 *  Initialize the program from a package.json
 *  project descriptor, optionally overriding
 *  the name, description and class to instantiate.
 *
 *  @param package The path to package.json.
 *  @param name A specific name for the root command (optional).
 *  @param description A specific description for the root command (optional).
 *  @param clazz A specific class to instantiate.
 */
function create(package, name, description, clazz) {
  clazz = clazz || Program;
  var program = new clazz(basename(process.argv[1]));
  program.package(package);
  if(name) program.name(name);
  if(description) program.description(description);
  return program;
}

module.exports = create;
module.exports.define = define;
module.exports.key = getKey;
module.exports.Program = Program;
module.exports.Command = Command;
module.exports.Option = Option;
module.exports.Flag = Flag;
