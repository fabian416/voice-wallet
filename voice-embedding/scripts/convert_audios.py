import os
import subprocess

AUDIO_DIR = "./audios"

for filename in os.listdir(AUDIO_DIR):
    if filename.endswith(".mp4") or filename.endswith(".m4a") or filename.endswith(".mov"):
        input_path = os.path.join(AUDIO_DIR, filename)
        output_path = input_path.rsplit(".", 1)[0] + ".wav"
        
        cmd = [
            "ffmpeg", "-i", input_path,
            "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1",
            output_path
        ]
        
        subprocess.run(cmd)
        print(f"Converted {filename} to .wav")