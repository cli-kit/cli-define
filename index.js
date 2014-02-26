var events = require('events');
var fs = require('fs');
var path = require('path'), basename = path.basename;
var util = require('util');
var camelcase = require('cli-util').camelcase;

var mutators = {
  cmd: {
    options: false,
    commands: false,
    names: false,
    key: true,
    name: true,
    description: true,
    action: true
  },
  arg: {
    names: false,
    key: true,
    name: true,
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
var re = {
  delimiter: function(){return /[ ,|]+/;},
  required: function(){return /^=?</;},
  multiple: function(){return /\.\.\./;},
  extra: function(){return /^([^=\[<]*)((=|\[|<).*)/;},
  no: function(){return /(\[no-?\]-?)/;},
  nor: function(){return /(\[?no-?\]?-?)/;}
}

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
function getKey(names, name) {
  var k, names = names || this._names;
  name = name || this._name;
  if(typeof names == 'string') {
    name = names;
    names = names.split(re.delimiter());
  }
  names = names.slice(0);
  if(this._extra) {
    var j = names.length -1;
    var nm = names[j];
    while(re.extra().test(nm) || re.multiple().test(nm)) {
      // allow for flush extra values
      if(/^-+/.test(nm)) {
        names[j] = nm.replace(re.extra(), "$1");
      }else{
        names.pop();
      }
      nm = names[--j];
    }
    this._names = sortNames(names);
  }
  var k = names.reduce(
    function (a, b) { return a.length > b.length ? a : b; });
  k = k.replace(/^-+/, '');
  return camelcase(k.toLowerCase());
}

function sortNames(names) {
  // sort short options before long options
  return names.sort(function(a, b) {
    var re = /^-[^-]/;
    return re.test(a) ? -1 : re.test(b) ? 1 : 0;
  });
}

/**
 *  Retrieve the extra portion of the option name.
 *
 *  Note this also updates the names array to not include
 *  the extra portion.
 */
function getExtra() {
  if(re.no().test(this._name)) {
    this._extra = false;
    return;
  }
  if(!re.extra().test(this._name)) return;
  this._extra = this._name.replace(re.extra(), "$2");
  //console.log(this._extra);
  var name = this._name.replace(re.extra(), "$1");
  //console.log('name: %s', name);
  this._names = name.split(re.delimiter());
  if(!this._names[this._names.length - 1]) this._names.pop();
  this._names = sortNames(this._names);
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
  define(this, '_name', name, true);
  define(this, '_description', description || '', true);
  define(this, '_key', '', true);
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

  if(!this._name || typeof this._name !== 'string') {
    throw new TypeError('Invalid argument name \'' + this._name + '\'');
  }

  // strip no prefixes
  var no = re.no();
  var name = '' + this._name;
  if((this instanceof Flag) && no.test(this._name)) {
    name = this._name.replace(no, '');
  }

  this._names = this._name.split(re.delimiter());
  //console.dir(this._names);
  getExtra.call(this);
  if(re.required().test(this._extra)) {
    this._optional = false;
  }
  if(re.multiple().test(this._extra)) {
    this._multiple = true;
  }
  this._key = getKey.call(this, name);
  //console.log('key', this._key);
}

for(k in EventProxy) {
  define(Argument.prototype, k, EventProxy[k], false);
}

function toString(delimiter) {
  if(!arguments.length) return Object.prototype.toString.call(this);
  delimiter = delimiter || ' | ';
  var names = sortNames(this.names());
  return names.join(delimiter);
}
define(Argument.prototype, 'toString', toString, false);


/**
 *  Retrieve a standardized string to use when listing options.
 */
getOptionString = function(delimiter, assignment) {
  assignment = assignment || '=';
  delimiter = delimiter || ', ';
  var extra = this.extra() ? this.extra() || '' : '';
  if(extra) {
    extra = extra.replace(/^(.?)=(.*)$/, "$1$2");
    extra = assignment + extra;
  }
  return this.toString(delimiter) + extra;
}
define(Argument.prototype, 'getOptionString', getOptionString, false);

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
  //this._value = false;
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
  define(this, '_options', {}, true);
  define(this, '_name', name || '', true);
  define(this, '_description', description || '', true);
  define(this, '_key', '', true);
  define(this, '_action', undefined, true);
  define(this, '_names', undefined, true);
  //define(this, '_package', undefined, true);

  // event emitter
  define(this, '_emitter', new events.EventEmitter(), false);
  define(this, '_events', undefined, true);
  define(this, '_maxListeners', undefined, true);
  define(this, 'domain', undefined, true);

  if((typeof options == 'object')) {
    initialize.call(this, options, Object.keys(mutators.cmd));
  }

  if(!this._name || typeof this._name !== 'string') {
    throw new TypeError('Invalid command name \'' + this._name + '\'');
  }

  this._names = this._name.split(re.delimiter());
  this._key = getKey.call(this);
}


define(Command.prototype, 'getOptionString', getOptionString, false);
define(Command.prototype, 'toString', toString, false);

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
  if(typeof name === 'string') {
    if(re.no().test(name) || !re.extra().test(name)) {
      clazz = Flag;
    }
  }
  var opt = (name instanceof clazz) ? name
    : new clazz(name, description, options, coerce, value);
  this._options[opt.key()] = opt;
  return this;
}
define(Command.prototype, 'option', option, false);

/**
 *  Define a flag argument explicitly.
 */
function flag(name, description, options, coerce, value) {
  var opt = (name instanceof Flag) ? name
    : new Flag(name, description, options, coerce, value);
  this._options[opt.key()] = opt;
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
 *  @param path The path to the package descriptor or an existing
 *  package object.
 */
function package(path) {
  if(!arguments.length) return this._package;
  if(arguments.length === 1 && !path) {
    this._package = path;
    return this._package;
  }
  var pkg;
  if(path && typeof(path) === 'string' && fs.existsSync(path)) {
    try {
      pkg = this._package = require(path);
    }catch(e) {
      throw new Error(util.format(
        'package parse error %s (malformed json)', path));
    }
  }else if(path && typeof path === 'object') {
    pkg = this._package = path;
  }
  if(!pkg) {
    throw new Error(util.format(
      'package descriptor %s does not exist', path));
  }
  this._version = pkg.version;
  if(pkg.description) this._description = pkg.description;
  return this;
}
define(Program.prototype, 'package', package, false);

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
module.exports.re = re;
module.exports.define = define;
module.exports.key = getKey;
module.exports.Program = Program;
module.exports.Command = Command;
module.exports.Option = Option;
module.exports.Flag = Flag;
