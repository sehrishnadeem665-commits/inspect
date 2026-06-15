from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from PIL import Image
import io
import torch
import torch.nn.functional as F
from transformers import AutoImageProcessor, AutoModelForImageClassification

app = FastAPI(title="Car Damage Detector Service")

# Load once at startup
MODEL_NAME = "beingamit99/car_damage_detection"
processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
model = AutoModelForImageClassification.from_pretrained(MODEL_NAME)
model.eval()

class DetectionResponse(BaseModel):
    damageType: str
    location: str
    confidence: float
    message: str


@app.post("/detect", response_model=DetectionResponse)
async def detect(image: UploadFile = File(...)):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    contents = await image.read()
    try:
        img = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image")

    # Preprocess & predict
    inputs = processor(images=img, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probs = F.softmax(logits, dim=-1).cpu().numpy()[0]
        predicted_id = int(probs.argmax())
        confidence = float(probs[predicted_id])
        label_map = model.config.id2label
        predicted_label = label_map.get(predicted_id, str(predicted_id))

    # Mock location logic (replace with real localization later)
    locations = ['front bumper', 'rear left door', 'right fender', 'roof', 'left mirror', 'unknown']
    location = locations[len(contents) % len(locations)]

    messages = {
        "Scratch": "Visible paint abrasion consistent with a surface scratch.",
        "Dent": "Deformation detected likely caused by an impact.",
        "None": "No obvious visual damage detected in the provided image."
    }
    message = messages.get(predicted_label, "Detection completed.")

    payload = {
        "damageType": predicted_label,
        "location": location,
        "confidence": round(confidence, 4),
        "message": message
    }
    return JSONResponse(content=payload)
