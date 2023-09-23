import cv2
import numpy as np
import argparse
import svgwrite
import os

def main(input_image_path, output_svg_path):
    # Load the image using OpenCV
    image = cv2.imread(input_image_path)

    if image is None:
        print("Error: Could not load the input image.")
        return

    # Apply edge detection (you can adjust parameters for your specific image)
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray_image, threshold1=10, threshold2=200)

    # Find contours in the edge image
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Create an SVG drawing
    svg_drawing = svgwrite.Drawing(output_svg_path, profile='tiny', size=(image.shape[1], image.shape[0]))

    # Draw contours as SVG paths without filling
    for contour in contours:
        points = np.squeeze(contour, axis=1)
        points = [(int(x), int(y)) for x, y in points]  # Convert to (x, y) integer pairs
        # Use "stroke" to set the outline color and "fill" to "none" to remove filling
        svg_drawing.add(svgwrite.shapes.Polygon(points=points, stroke=svgwrite.rgb(0, 0, 0, '%'), fill='none'))

    # Save the SVG file
    svg_drawing.save()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert an image of a floor plan to SVG outline.")
    parser.add_argument("input_image", help="Path to the input image file.")
    parser.add_argument("output_svg", help="Path to save the output SVG file.")

    args = parser.parse_args()

    input_image_path = args.input_image
    output_svg_path = args.output_svg

    if not os.path.exists(input_image_path):
        print("Error: Input image file does not exist.")
    else:
        main(input_image_path, output_svg_path)
