import base64
import json
from io import BytesIO
from PIL import Image
import face_recognition as fr
import numpy as np

def encode_face_from_image(image_data):
    """
    Extract face encoding from base64 image data.
    Returns the face encoding as a list (numpy arrays converted to list for JSON serialization)
    """
    try:
        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(BytesIO(image_bytes))
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert PIL image to numpy array
        image_array = np.array(image)
        
        # Get face encodings
        face_encodings = fr.face_encodings(image_array)
        
        if len(face_encodings) == 0:
            return None
        
        # Return the first face encoding found
        return face_encodings[0].tolist()
    except Exception as e:
        print(f"Error encoding face: {e}")
        return None

def compare_faces(known_encoding, unknown_encoding, tolerance=0.6):
    """
    Compare two face encodings and return if they match.
    tolerance: lower values are more strict (0.6 is default, 0.5 is strict)
    """
    try:
        known = np.array(known_encoding)
        unknown = np.array(unknown_encoding)
        
        # Calculate face distance
        face_distance = fr.face_distance([known], unknown)[0]
        
        # Return True if distance is below tolerance
        return face_distance < tolerance, face_distance
    except Exception as e:
        print(f"Error comparing faces: {e}")
        return False, 1.0

def verify_student_face(current_face_encoding, registered_face_encoding):
    """
    Verify if current face matches the registered face.
    Returns: {
        'verified': bool,
        'confidence': float (0-1, where 1 is perfect match),
        'message': str
    }
    """
    match, distance = compare_faces(registered_face_encoding, current_face_encoding)
    
    confidence = 1 - distance  # Convert distance to confidence score
    
    return {
        'verified': match,
        'confidence': float(confidence),
        'message': 'Face verified successfully' if match else 'Face does not match'
    }

def process_attendance_request(image_data, registered_face_encoding):
    """
    Process a complete attendance request with face recognition.
    """
    current_encoding = encode_face_from_image(image_data)
    
    if current_encoding is None:
        return {
            'success': False,
            'message': 'No face detected in the image',
            'verified': False
        }
    
    verification = verify_student_face(current_encoding, registered_face_encoding)
    
    return {
        'success': True,
        'verified': verification['verified'],
        'confidence': verification['confidence'],
        'message': verification['message']
    }

# Example usage (for testing)
if __name__ == '__main__':
    print("Face recognition service loaded successfully")
