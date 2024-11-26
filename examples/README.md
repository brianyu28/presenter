# Examples

Example Presenter.js presentations.

## Usage

The examples currently require [symlinking the Presenter.js package](https://docs.npmjs.com/cli/v9/commands/npm-link).

In the root of this repository, run:

```
$ npm link
```

Then, in each of the examples, e.g. `examples/simple`, run:

```
$ npm link presenter
```

This symlinks the local version of the `presenter` package into the example presentation.

Then, run the development server with `npm run serve` or build the production version with `npm run build`.
