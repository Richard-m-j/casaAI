from flask import Flask
from flask_cors import CORS
import requests
import io
import base64
from PIL import Image, PngImagePlugin

app = Flask(__name__)
CORS(app)


@app.route("/generate")

def generate():
    url = "http://127.0.0.1:7860"

    payload = {
        "prompt": "kung fu panda",
        "steps": 5
    }

    response = requests.post(url=f'{url}/sdapi/v1/txt2img', json=payload)

    res = response.json()
    imgList = []

    for i in res['images']:
        imgList.append(i.split(",",1)[0])
        image = Image.open(io.BytesIO(base64.b64decode(i.split(",",1)[0])))

        png_payload = {
            "image": "data:image/png;base64," + i
        }
        response2 = requests.post(url=f'{url}/sdapi/v1/png-info', json=png_payload)

        pnginfo = PngImagePlugin.PngInfo()
        pnginfo.add_text("parameters", response2.json().get("info"))
        image.save('output.png', pnginfo=pnginfo)
    return {'message': imgList}

if __name__ == '__main__':
    app.run(debug=True)