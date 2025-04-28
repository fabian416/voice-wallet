import os
import numpy as np
from resemblyzer import VoiceEncoder, preprocess_wav

encoder = VoiceEncoder()

AUDIO_DIR = "../audios"
EMBEDDING_DIR = "../embeddings"

os.makedirs(EMBEDDING_DIR, exist_ok=True)

for filename in os.listdir(AUDIO_DIR):
    if filename.endswith(".wav"):
        path = os.path.join(AUDIO_DIR, filename)
        wav = preprocess_wav(path)
        embedding = encoder.embed_utterance(wav)
        np.save(os.path.join(EMBEDDING_DIR, filename.replace(".wav", ".npy")), embedding)
        print(f"Processed {filename}")