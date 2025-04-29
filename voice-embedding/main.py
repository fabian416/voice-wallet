from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from resemblyzer import VoiceEncoder, preprocess_wav
import numpy as np
import tempfile
from pydub import AudioSegment

app = FastAPI()

# Habilita CORS para permitir requests del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # en producción poné tu dominio frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

encoder = VoiceEncoder()

@app.post("/process")
async def process_voice(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as temp_webm:
        temp_webm.write(await file.read())
        temp_webm.flush()
        # Convertimos de webm a wav (pydub requiere ffmpeg instalado)
        audio = AudioSegment.from_file(temp_webm.name)
        wav_path = temp_webm.name.replace(".webm", ".wav")
        audio.export(wav_path, format="wav")

    wav = preprocess_wav(wav_path)
    embedding = encoder.embed_utterance(wav)
    return { "embedding": embedding.tolist() }