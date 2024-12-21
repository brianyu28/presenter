# `vectex`

`vectex` is a utility program for generating SVGs out of LaTeX equations.

## Usage

Generate a SVG file for a formula:

```bash
$ vectex equation.svg
\frac{x}{y}
```

Given a text file `equation.txt` with equation content like `\frac{x}{y}`, convert to SVG:

```bash
$ vectex equation.svg < equation.txt
```

By default, vector is black. To change the color, use:

```bash
$ vectex equation.svg "#ff0000" < equation.txt
```
