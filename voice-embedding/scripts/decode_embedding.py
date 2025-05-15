import base64
import numpy as np
import sys

# Path to the file .b64.txt as argument
b64_path = sys.argv[1]

# Read string base64 frm the file 
with open(b64_path, "r") as f:
    b64_string = f.read()

# Decode Base64 to bytes
embedding_bytes = base64.b64decode(b64_string)

# Re build the array NumPy (float32, 256 dimension)
embedding = np.frombuffer(embedding_bytes, dtype=np.float32)

# Verify form and values of the array
print(f"Embedding shape: {embedding.shape}")
print(f"Primeros 5 valores: {embedding[:5]}")