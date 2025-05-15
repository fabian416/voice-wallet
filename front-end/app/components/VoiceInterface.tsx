'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const VoiceInterface = () => {
  const [isListening, setIsListening] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'voice_recording.webm');

        try {
          setStatusMessage('🔄 Uploading...');
          const response = await fetch('http://localhost:5000/verify', {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();
          if (response.ok) {
            setStatusMessage(`${result.status}`);
          } else {
            setStatusMessage(`${result.error || 'Unknown error'}`);
          }
        } catch (error) {
          console.error(error);
          setStatusMessage(`Error: ${error}`);
        }
      };

      mediaRecorder.start();
      setIsListening(true);
      setStatusMessage('🎙️ Recording...');
    } catch (err) {
      console.error('Microphone error', err);
      setStatusMessage('Microphone access error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    isListening ? stopRecording() : startRecording();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <Card className="p-8 flex flex-col items-center gap-6 bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-xl shadow-xl w-full max-w-md">
        <div className="text-2xl font-bold mb-4">Wally AI Assistant</div>

        <Button
          onClick={toggleListening}
          className={`w-24 h-24 rounded-full transition-all duration-300 ${
            isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isListening ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
        </Button>

        <div className="text-center mt-4">
          <p className="text-gray-300">{statusMessage || 'Tap to start speaking'}</p>
        </div>
      </Card>
    </div>
  );
};