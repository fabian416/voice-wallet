import os
import numpy as np
import base64
from resemblyzer import VoiceEncoder, preprocess_wav

encoder = VoiceEncoder()

AUDIO_DIR = "./audios"
EMBEDDING_DIR = "./embeddings"

os.makedirs(EMBEDDING_DIR, exist_ok=True)

for filename in os.listdir(AUDIO_DIR):
    if filename.endswith(".wav"):
        path = os.path.join(AUDIO_DIR, filename)
        wav = preprocess_wav(path)
        embedding = encoder.embed_utterance(wav)

        # save .npy
        npy_path = os.path.join(EMBEDDING_DIR, filename.replace(".wav", ".npy"))
        np.save(npy_path, embedding)

        # Convert to base64
        embedding_bytes = embedding.tobytes()
        embedding_b64 = base64.b64encode(embedding_bytes).decode("utf-8")

        # Save base64 as .txt
        b64_path = os.path.join(EMBEDDING_DIR, filename.replace(".wav", ".b64.txt"))
        with open(b64_path, "w") as f:
            f.write(embedding_b64)

        print(f"Processed {filename} → Saved .npy and .b64.txt")