# Presenter Browser

A Chromium application to show a Presenter.js presentation in a borderless window.

Run the app with `npm run start`.

Build the app with `npm run make`.

## Usage

Presenter Browser will automatically open to `http://localhost:8080`, so it will
present any Presenter.js presentation running on that port.

To automatically launch Presenter Browser when running `npm run serve` from
a Presenter.js presentation, set the script in `package.json` to:

```json
"serve": "NODE_ENV=development webpack serve"
```

And then set the value of `devServer` in `webpack.config.js` as follows:

```js
  devServer: {
    static: "./dist",
    open: {
      app: {
        name: "Presenter",
      },
    },
  },
```
