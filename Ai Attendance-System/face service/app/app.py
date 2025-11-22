from fastapi import FastAPI, File, UploadFile, HTTPException
import face_recognition
import numpy as np
from io import BytesIO
from PIL import Image

app = FastAPI(title="Face Recognition Service")

@app.get("/")
def root():
    return {"message": "Face Recognition API running!"}

@app.post("/face/enroll")
async def enroll_face(file: UploadFile = File(...)):
    """Takes an uploaded image and returns the face embedding"""
    img_bytes = await file.read()
    img = face_recognition.load_image_file(BytesIO(img_bytes))
    encodings = face_recognition.face_encodings(img)

    if len(encodings) == 0:
        raise HTTPException(status_code=400, detail="No face found")

    embedding = encodings[0].tolist()
    return {"embedding": embedding}

@app.post("/face/verify")
async def verify_face(file: UploadFile = File(...), known_embedding: list[float] = []):
    """Compares uploaded face with a stored embedding"""
    img_bytes = await file.read()
    img = face_recognition.load_image_file(BytesIO(img_bytes))
    encodings = face_recognition.face_encodings(img)

    if len(encodings) == 0:
        raise HTTPException(status_code=400, detail="No face found")

    face_embedding = encodings[0]
    known_embedding = np.array(known_embedding)

    # cosine similarity (smaller distance = better match)
    distance = np.linalg.norm(face_embedding - known_embedding)
    threshold = 0.6
    verified = distance < threshold

    return {"verified": verified, "distance": float(distance)}
