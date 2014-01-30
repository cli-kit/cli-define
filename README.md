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
var cli = require('cli-define')('./package.json');
```

### Module

#### .(package, [name], [description])

* `package`: Path to the module `package.json` used to extract default program version and description information.
* `name`: Specific name for the program.
* `description`: Specific description for the program.


### Program

#### help([name], [description], [action])

```
program.help()
program.help('--help')
program.help(function(help){help.call(this)})
```

Adds a help flag to the program, scope for the callback is the program instance access to the entire program data is available via `this`.

* `name`: A specific name for the help option flags, default is `-h | --help`.
* `description`: A specific description for the option, overrides the default.
* `action`: A callback to invoke when the help option is encountered, signature is `function(help)` where `help` is the default callback function if you wish to re-use it's functionality.

Returns the program for chaining.

#### usage(usage)

```
program.usage('[command] [options] <files...>')
```

Sets a custom program usage string override the default behaviour. 

* `usage`: The usage string.

Returns the program for chaining.

#### version([version], [name], [description], [action])

```
program.version()
program.version('1.0.0')
program.version('1.0.0', '--version')
program.version(function(version){version.call(this)})
```

Adds a version flag to the program, scope for the callback is the program instance access to the entire program data is available via `this`, configured version number is available via `this._version`.

* `version`: A specific version for the program, overrides any version extracted from `package.json`.
* `name`: A specific name for the version option flags, default is `-V | --version`.
* `description`: A specific description for the option, overrides the default.
* `action`: A callback to invoke when the version option is encountered, signature is `function(version)` where `version` is the default callback function if you wish to re-use it's functionality.

Returns the program for chaining.

### Command

### Option

### Flag

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](/LICENSE) if you feel inclined.
