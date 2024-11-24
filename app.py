from flask import Flask, render_template, request, jsonify
import torch
from diffusers import StableDiffusionPipeline
import os
from PIL import Image

app = Flask(__name__)

# Initialize the Stable Diffusion model
def setup_model():
    model_id = "stabilityai/stable-diffusion-2-1"
    pipe = StableDiffusionPipeline.from_pretrained(model_id, safety_checker=None)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    pipe = pipe.to(device)
    return pipe

pipe = setup_model()  # Load the model once at startup

@app.route("/")
def index():
    return render_template("form.html")

@app.route("/generate_design", methods=["POST"])
def generate_design():
    try:
        # Get form data
        room_type = request.form.get("room_type")
        room_size = request.form.get("room_size")
        furniture = request.form.get("furniture")
        style = request.form.get("style")

        # Construct the prompt
        prompt = (
            f"a full front-side view of a {style} style {room_size} {room_type}, "
            f"showing the entire room layout with a complete arrangement of {furniture}. "
            "The design should include all elements such as walls, windows, doors, furniture, decorations, and lighting, "
            "arranged symmetrically and realistically. "
            "The furniture should be clearly visible from the front perspective, with no elements cut off, "
            "and all items (such as {furniture}) should be accurately placed within the room. "
            "The design should resemble an architectural elevation or 3D rendering, "
            "with photorealistic details, clear structure, and clean lines."
        )

        # Generate the image
        images = pipe(prompt).images
        image_filename = "static/images/interior_design.png"
        images[0].save(image_filename)

        return jsonify({"image_url": f"/{image_filename}"})  # Send image URL to frontend

    except Exception as e:
        return jsonify({"error": str(e)})

@app.route("/results")
def results():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True, port=5000)

