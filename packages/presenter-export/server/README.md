# Presenter Export Server

Some Presenter.js exports require additional processing, particularly if
slides contain content across different components, e.g. a combination of SVG
content and Canvas-based additional content.

In those cases, `presenter-export` can send data to this locally-running
Presenter Export Server to handle additional image processing before saving
exported assets.

## Usage

First, install dependencies.

```bash
pip install requirements.txt
```

Then, set environment variable for where exported files should land.

```bash
export OUTPUT_DESTINATION=/path/to/destination
```

Then, run server.

```bash
flask run
```
