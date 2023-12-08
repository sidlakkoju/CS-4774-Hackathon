from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import tensorflow as tf
from PIL import Image
import io
import numpy as np
import firebase_admin
from firebase_admin import credentials, storage
import uuid


app = FastAPI()

database = []

# Load your pre-trained TensorFlow model
model = tf.keras.applications.MobileNetV2(weights="imagenet")
# Load the class labels used by the MobileNetV2 model
labels_path = tf.keras.utils.get_file("ImageNetLabels.txt", "https://storage.googleapis.com/download.tensorflow.org/data/ImageNetLabels.txt")
with open(labels_path) as f:
    labels = f.readlines()

# TODO: Initialize Firebase Admin SDK
cred = credentials.Certificate("firebase-config.json")
firebase_admin.initialize_app(cred, {"storageBucket": "sidandleo.appspot.com"})
# Initialize Firebase Admin SDK using the credentials file
# firebase_admin.initialize_app(cred)


def preprocess_image(image):
    # Resize the image to the required input shape of the model
    img_array = tf.image.resize(image, (224, 224))
    # Expand dimensions to create a batch-size of 1
    img_array = tf.expand_dims(img_array, 0)
    # Preprocess the image by normalizing pixel values to the range [0, 1]
    img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
    return img_array

def perform_object_detection(image):
    # Preprocess the image
    input_image = preprocess_image(image)

    # Get the model's prediction
    predictions = model.predict(input_image)

    # Decode and print the top-3 predicted classes
    decoded_predictions = tf.keras.applications.mobilenet_v2.decode_predictions(predictions)[0]

    # Create a dictionary with class labels and their corresponding probabilities
    results = {label: float(prob) for (_, label, prob) in decoded_predictions}

    return results

def upload_to_firebase(image, results):
    # Convert the image to bytes
    image_bytes = io.BytesIO()
    image.save(image_bytes, format="JPEG")
    image_bytes = image_bytes.getvalue()

    # Create a unique filename, you can use any logic to generate one
    filename = str(uuid.uuid4()) + ".jpg"
    # filename = "uploaded_image.jpg"

    # Upload image to Firebase Storage
    bucket = storage.bucket()
    blob = bucket.blob(filename)
    blob.upload_from_string(image_bytes, content_type="image/jpeg")
    blob.make_public()

    # Get the publicly accessible URL of the uploaded image
    image_url = blob.public_url

    # Associate the results with the uploaded image
    results["image_url"] = image_url

    return results

@app.post("/upload-photo/")
async def upload_photo(file: UploadFile = File(...)):
    try:
        # Read the image file
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        # Perform object detection
        result = perform_object_detection(image)

        # Upload the photo to Firebase Storage and associate results
        results_with_url = upload_to_firebase(image, result)
        
        # TODO: store results_with_url in a database for later retrieval

        database.append(results_with_url)

        return JSONResponse(content=results_with_url, status_code=200)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/get-all-results/")
async def get_all_results():
    return JSONResponse(content=database, status_code=200)
