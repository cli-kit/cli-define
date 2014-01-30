# Define

Defines the arguments for a command line interface.

## Install

```
npm install cli-define
```

## Test

```
npm test
```

## API

```
var path = require('path');
var cli = require('cli-define')(path.join(__dirname, 'package.json'));
cli
  .option('-f --file', 'file to install')
  .flag('-v --verbose', 'print more information')
  .version()
  .help()
cli.command('install')
  .description('install a package')
  .action(function(cmd, args) {})
console.dir(cli);
```

### Module

#### .(package, [name], [description])

Initialize the program.

* `package`: Path to the module `package.json` used to extract default program version and description.
* `name`: Specific name for the program, overrides `package.json`.
* `description`: Specific description for the program, overrides `package.json`.

Returns a `Program` instance.

### Program(package, [name], [description])

The root of the definition hierarchy, `Program` extends `Command`.

#### _description

The program description.

#### _name

The program name.

#### _version

The program version.

#### help([name], [description], [action])

```
program.help()
program.help('--help')
program.help(function(help){help.call(this)})
```

Adds a help flag to the program, scope for the callback is the program instance access to the program is available via `this`.

* `name`: A specific name for the help option flags, default is `-h | --help`.
* `description`: A specific description for the option, overrides the default.
* `action`: A callback to invoke when the help option is encountered, signature is `function(help)` where `help` is the default callback function if you wish to re-use it's functionality.

Returns the program for chaining.

#### usage(usage)

```
program.usage('[command] [options] <files...>')
```

Sets a custom program usage string, overrides the default behaviour. 

* `usage`: The usage string.

Returns the program for chaining.

#### version([version], [name], [description], [action])

```
program.version()
program.version('1.0.0')
program.version('1.0.0', '--version')
program.version(function(version){version.call(this)})
```

Adds a version flag to the program, scope for the callback is the program instance access to the program is available via `this`, configured version number is available via `this._version`.

* `version`: A specific version for the program, overrides any version extracted from `package.json`.
* `name`: A specific name for the version option flags, default is `-V | --version`.
* `description`: A specific description for the option, overrides the default.
* `action`: A callback to invoke when the version option is encountered, signature is `function(version)` where `version` is the default callback function if you wish to re-use it's functionality.

Returns the program for chaining.

### Command(name, [description], [options])

Represents a command option.

#### _commands

Map of command options.

#### _arguments

Map of non-command options.

#### command(name, [description], [options])

```
program.command('install', 'install a package')
program.command('install')
  .description('install a package')
  .action(function(cmd, args){})
```

Adds a command option.

* `name`: The name of the command.
* `description`: The command description.
* `options`: The argument options.

If `description` is specified returns the `Program` otherwise the `Command` instance.

#### option(name, [description], [options])

```
program.option('-f --file', 'file to install')
program.option('-f, --file', 'file to install')
program.option('-f | --file', 'file to install')
```

Adds an option to the command.

* `name`: The name of the option.
* `description`: The option description.
* `options`: The argument options.

Returns the parent `Command` for chaining.

#### flag(name, [description], [options])

```
program.flag('-v --verbose', 'print more information')
program.flag('-v, --verbose', 'print more information')
program.flag('-v | --verbose', 'print more information')
```

Adds a flag option to the command.

* `name`: The name of the flag.
* `description`: The flag description.
* `options`: The argument options.

Returns the parent `Command` for chaining.

### Option(name, [description], [options])

Represents an option that expects a value, shares all the functionality of the `Argument` super class.

### Flag(name, [description], [options])

Represents an option that does not expect a value and is treated as a `boolean`, shares all the functionality of the `Argument` super class.

### Argument(name, [description], [options])

Abstract super class for all argument definition classes.

You may specify any of the properties below on the options object and they will be transferred to the instance.

Note that you may also specify `action` and `description` properties on the options and the appropriate mutator methods will be called.

#### action([fn])

Get or set a callback function for the argument, this is typically used by `Command` arguments but can also be specified for other arguments.

* `fn`: The callback function.

#### converter

A function used to coerce the argument value.

#### description([description])

Get or set the description for the argument.

* `description`: The argument description.

#### extra

A string representing the remainder of an argument name, given a `name` of `-i --integer <n>`, `extra` will equal `<n>`.

#### key

The `key` for the argument automatically generated based on the argument `name`.

```
-v            // => v
-v --verbose  // => verbose
-p --port <n> // => port
```

#### id

A field reserved for user data, currently unused but could be used for i18n message lookup.

#### name

The string name of the argument.

```
-v
-v --verbose
-v, --verbose
-v | --verbose
-p --port <n>
```

#### optional

A `boolean` indicating that the argument is optional.

#### validator

A function used to validate the argument value.

#### value

A value assigned to the instance after argument parsing, this may be used to set the default value for an argument.

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](/LICENSE) if you feel inclined.
