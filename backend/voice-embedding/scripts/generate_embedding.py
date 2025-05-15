# generate_embedding.py
import sys
import base64
import numpy as np
from resemblyzer import VoiceEncoder, preprocess_wav

# Takes the path to the file .wav as argument 
audio_path = sys.argv[1]

# Generate embedding
encoder = VoiceEncoder()
wav = preprocess_wav(audio_path)
embedding = encoder.embed_utterance(wav)

# Convert to base64
embedding_b64 = base64.b64encode(embedding.tobytes()).decode("utf-8")

# Print (NestJS lo capturará desde stdout)
print(embedding_b64)