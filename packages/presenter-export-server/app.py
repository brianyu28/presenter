from io import BytesIO
import base64
import os

from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
CORS(app)

# Specify where files should be saved after export.
OUTPUT_DESTINATION = os.environ.get("OUTPUT_DESTINATION")
if OUTPUT_DESTINATION is None:
    raise ValueError("Environment variable OUTPUT_DESTINATION not set.")


@app.route("/export", methods=["POST"])
def export():
    """Export a new image."""
    data = request.json
    if data is None:
        return jsonify({"success": False, "error": "No data provided."})

    # Get parameters from the request.
    filename: str = data.get("filename")
    background_data: str | None = data.get("backgroundDataUrl")
    canvas_data: str | None = data.get("canvasDataUrl")
    svg_data: str | None = data.get("svgDataUrl")

    if background_data is None:
        return jsonify({"success": False, "error": "No background data provided."})

    if svg_data is None:
        return jsonify({"success": False, "error": "No SVG data provided."})

    # Get Background image
    _, background_data = background_data.split(",", 1)
    background_image = Image.open(BytesIO(base64.b64decode(background_data)))

    # Get SVG image
    _, svg_data = svg_data.split(",", 1)
    svg_image = Image.open(BytesIO(base64.b64decode(svg_data)))

    # Get Canvas image
    if canvas_data is not None:
        _, canvas_data = canvas_data.split(",", 1)
        canvas_image = Image.open(BytesIO(base64.b64decode(canvas_data)))
    else:
        canvas_image = None

    # Composite images
    result = background_image
    if canvas_image is not None:
        result = Image.alpha_composite(result, canvas_image)
    result = Image.alpha_composite(result, svg_image)

    assert OUTPUT_DESTINATION is not None
    result.save(os.path.join(OUTPUT_DESTINATION, filename))

    return jsonify({"success": True})


@app.route("/generate-pdf", methods=["POST"])
def generate_pdf():
    """Generates a PDF of existing images."""
    data = request.json
    if data is None:
        return jsonify({"success": False, "error": "No data provided."})

    images = data.get("images")
    filename: str = data.get("filename")

    assert OUTPUT_DESTINATION is not None
    images = [
        Image.open(os.path.join(OUTPUT_DESTINATION, filename))
        for filename in images
    ]

    # Save images as a PDF
    pdf_path = os.path.join(OUTPUT_DESTINATION, filename)
    images[0].save(pdf_path, save_all=True, append_images=images[1:])

    return jsonify({"success": True})
