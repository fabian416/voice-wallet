import os
import numpy as np

EMBEDDING_DIR = "./embeddings"

embedding1 = np.load(os.path.join(EMBEDDING_DIR, "audio1.npy"))
embedding2 = np.load(os.path.join(EMBEDDING_DIR, "audio2.npy"))

distance = np.linalg.norm(embedding1 - embedding2)
print(f"Distance: {distance}")

threshold = 0.25

if distance < threshold:
    print("Voices match")
else:
    print("Voices do not match")