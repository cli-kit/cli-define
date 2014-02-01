# Define

Chainable argument builder for a command line interface.

## Install

```
npm install cli-define
```

## Test

```
npm test
```

## API

```javascript
var path = require('path');
var cli = require('cli-define')(path.join(__dirname, 'package.json'));
cli
  .option('-f --file <file...>', 'files to install')
  .option('-v --verbose', 'print more information')
  .version()
  .help()
cli.command('cp')
  .description('copy files')
  .action(function(cmd, options, raw) {
    // execute copy logic here, scope is the program instance
    console.dir(this.file);
  })
console.dir(cli);
```

The recommended way to define options is to use the self-documenting `name` convention:

```javascript
-v                            // => flag
-v --verbose                  // => flag
-v, --verbose                 // => flag
-v | --verbose                // => flag
--option [value]              // => option (optional) 
--option <value>              // => option (required)
--option [value...]           // => option (optional, repeatable)
--option <value...>           // => option (required, repeatable)
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

```javascript
cli.help()
cli.help('--help')
cli.help(function(help){help.call(this)})
```

Adds a help flag to the program, scope for the callback is the program instance access to the program is available via `this`.

* `name`: A specific name for the help option flags, default is `-h | --help`.
* `description`: A specific description for the option, overrides the default.
* `action`: A callback to invoke when the help option is encountered, signature is `function(help)` where `help` is the default callback function if you wish to re-use it's functionality.

Returns the program for chaining.

#### usage(usage)

```javascript
cli.usage('[command] [options] <files...>')
```

Sets a custom program usage string, overrides the default behaviour. 

* `usage`: The usage string.

Returns the program for chaining.

#### version([version], [name], [description], [action])

```javascript
cli.version()
cli.version('1.0.0')
cli.version('1.0.0', '--version')
cli.version(function(version){version.call(this)})
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

```javascript
cli.command('install', 'install a package')
cli.command('install')
  .description('install a package')
  .action(function(cmd, args){})
```

Adds a command option.

* `name`: The name of the command.
* `description`: The command description.
* `options`: The argument options.

If `description` is specified returns the `Program` otherwise the `Command` instance.

#### option(name, [description], [options])

```javascript
cli.option('-d', 'debug')                                 // => Flag
cli.option('--debug', 'debug')                            // => Flag
cli.option('-v --verbose', 'verbose')                     // => Flag
cli.option('--port [n]', 'port')                          // => Optional option
cli.option('--port [n]', 'port', 8080)                    // => Optional option w/default
cli.option('--port <n>', 'port', parseInt)                // => Required option w/coercion
cli.option('--port [n]', 'port', 8080, parseInt)          // => Optional option w/default+coercion
cli.option('--port [n]', 'port', parseInt, 8080)          // => Optional option w/coercion+default
```

Adds an option to the command.

* `name`: The name of the option.
* `description`: The option description.
* `options`: The argument options.

Returns the parent `Command` for chaining.

#### flag(name, [description], [options])

```javascript
cli.flag('-v --verbose', 'print more information')
cli.flag('-v, --verbose', 'print more information')
cli.flag('-v | --verbose', 'print more information')
```

Explicityl adds a flag option to the command.

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

```javascript
-v            // => v
-v --verbose  // => verbose
-p --port <n> // => port
```

#### id

A field reserved for user data, currently unused but could be used for i18n message lookup.

#### multiple

A `boolean` indicating that the argument may be repated, default is `false`.

#### name

The string name of the argument.

```javascript
-v
-v --verbose
-v, --verbose
-v | --verbose
-p --port <n>
```

#### optional

A `boolean` indicating that the argument is optional, default is `true`.

#### value

A value assigned to the instance after argument parsing, this may be used to set the default value for an argument.

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](/LICENSE) if you feel inclined.
