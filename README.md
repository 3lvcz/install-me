# install-em

NodeJS utility for dependency management.

## Example

manifest.json
```json
{
    "production": {
        "react": "^16",
        "react-dom": "^16"
    },
    "build": {
        "webpack": "^5",
    },
    "code-quality": {
        "eslint": "latest"
    }
}
```

terminal:
```bash
install-em -m manifest.json -t /Users/me/example/ build code-quality
```

## CLI

### Options

**-m, --manifest**: path to directory/json-file, where manifest is located (looks for `package.json`, if directory is given, and looks for `./package.json` of current directory, if no parameter given)

**-t, --target**: installation destination directory (would create `node_modules` there)

**-f, --force**: reinstall dependencies, even they are already installed.

### Custom groups

You free to use any group names, that satisfy `/[a-zA-Z0-9_-]+/`.

### Group aliases

Also, there is some aliases to use with standard `package.json` files:

**-p, --prod**: use `dependencies` group

**-d, --dev**: use `devDependencies` group

**-o, --optional**: use `optionalDependencies` group

example:

```json
{
    "dependencies": {
        "lodash": "4"
    },
    "devDependencies": {
        "rimraf": "latest"
    },
    "foo": {
        "left-pad": "^1.3.0"
    }
}
```

```bash
install-em -p --dev -f foo
```

executes in current directory:

```bash
npm install --no-save --force lodash@4 rimraf@latest left-pad@^1.3.0
```

## API

```javascript
const { installDependency, installDependencies } = require('install-em');
```

`installDependency(name, version, path[, opts])`

**name** (string): dependency name

**version** (string): dependency version

**path** (string): installation destination folder

**opts** (object)

**opts.force** (boolean): reinstall dependency, even it's already installed in destination directory (false, by default)

**returns**: Promise

`installDependencies(dependencies, path[, opts])`

**dependencies** (Array): array of name/version pairs, like [[name, version], [name, version]]

**path** (string): installation destination folder

**opts** (object)

**opts.force** (boolean): reinstall dependency, even it's already installed in destination directory (false, by default)
