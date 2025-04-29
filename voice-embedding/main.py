# main.py
from flask import Flask, request, jsonify
from resemblyzer import VoiceEncoder, preprocess_wav
import numpy as np
import os
import subprocess

app = Flask(__name__)
encoder = VoiceEncoder()

def compute_voice_commitment(embedding):
    # Scale float embedding to field-like integers (simulate Noir inputs)
    field_embedding = [int(val * 10**6) for val in embedding]
    return field_embedding

@app.route("/register", methods=["POST"])
def register_voice():
    file = request.files["audio"]
    path = "./audios/voice_register.wav"
    file.save(path)

    wav = preprocess_wav(path)
    embedding = encoder.embed_utterance(wav)
    field_embedding = compute_voice_commitment(embedding)

    # Save embedding to file for witness input
    with open("Prover.toml", "w") as f:
        f.write(f'voice_embedding = [{", ".join(map(str, field_embedding))}]\n')

    # Run nargo execute to compute commitment from embedding
    subprocess.run(["nargo", "execute"], check=True)

    # Read calculated commitment from witness or print
    # Alternatively, return it directly for frontend to send on-chain
    return jsonify({"status": "success", "message": "Voice registered"}), 200

@app.route("/verify", methods=["POST"])
def verify_voice():
    file = request.files["audio"]
    path = "./audios/voice_verify.wav"
    file.save(path)

    wav = preprocess_wav(path)
    embedding = encoder.embed_utterance(wav)
    field_embedding = compute_voice_commitment(embedding)

    with open("Prover.toml", "w") as f:
        f.write(f'voice_embedding = [{", ".join(map(str, field_embedding))}]\n')

    subprocess.run(["nargo", "execute"], check=True)
    subprocess.run([
        "bb", "prove", "-b", "./target/voice_circuit.json", "-w", "./target/voice_circuit.gz", "-o", "./target"
    ], check=True)

    return jsonify({"status": "proof generated", "proof_path": "./target/proof"}), 200

if __name__ == "__main__":
    app.run(debug=True)