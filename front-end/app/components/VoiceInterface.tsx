'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from 'next/navigation';


const PHRASE_TO_SAY = "My voice is my key. I am the only one who can open it.";

export const VoiceInterface = () => {
  const [isListening, setIsListening] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === 'recording') {
        stopRecording();
      }
    };
  }, []);
  

  useEffect(() => {
    const voiceprint = localStorage.getItem('voiceprint');
    if (voiceprint && voiceprint != "undefined" && voiceprint !== "") {
      router.push("/create-account")
    }
  }, [statusMessage]);
  


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

      mediaRecorder.start();
      setIsListening(true);
      setCountdown(8);
      setStatusMessage('🎙️ Recording... please say the phrase.');

      // Start countdown timer
      countdownInterval.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev && prev > 1) {
            return prev - 1;
          } else {
            clearInterval(countdownInterval.current!);
            countdownInterval.current = null;
      
            setCountdown(0);
      
            // ⏱️ Esperar 100ms antes de detener grabación
            setTimeout(() => {
              stopRecording();
            }, 100);
      
            return 0;
          }
        });
      }, 1000);
    } catch (err) {
      console.error('Microphone error', err);
      setStatusMessage('Microphone access error');
    }
  };

  const stopRecording = () => {
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
      countdownInterval.current = null;
    }

    return new Promise<void>((resolve) => {
      if (mediaRecorderRef.current?.state === 'recording') {
        const mediaRecorder = mediaRecorderRef.current;

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

          console.log("🎧 Recorded blob size:", audioBlob.size);
          if (audioBlob.size === 0) {
            setStatusMessage('⚠️ Recording failed (empty audio)');
            resolve();
            return;
          }

          const formData = new FormData();
          formData.append('audio', audioBlob, 'voice_recording.webm');

          try {
            setStatusMessage('🔄 Uploading...');
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/voice/create-voiceprint`, {
              method: 'POST',
              body: formData,
            });

            const result = await response.json();
            console.log({result});
            if (response.ok) {
              localStorage.setItem('voiceprint', result.voiceprint);
              setStatusMessage("✅ Done.");
            } else {
              setStatusMessage(`${result.error || 'Unknown error'}`);
            }
          } catch (error) {
            console.error(error);
            setStatusMessage(`Error: ${error}`);
          } finally {
            resolve();
          }
        };

        mediaRecorder.stop();
      } else {
        resolve();
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      setIsListening(false);
      setCountdown(null);
    });
  };

  const resetRecording = () => {
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
      countdownInterval.current = null;
    }
  
    audioChunksRef.current = [];
    setStatusMessage('');
    setCountdown(null);
    setIsListening(false);
  
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
  };

  const toggleListening = () => {
    if (!isListening) {
      startRecording();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[45vh] pt-12">
      <Card className="p-10 flex flex-col items-center gap-6 bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-xl shadow-xl w-full max-w-md">

        <p className="text-md text-gray-400 text-center italic">
          Say this phrase:
        </p>
        <p className="text-md text-white text-center font-semibold mb-2">
          “{PHRASE_TO_SAY}”
        </p>

        <Button
          onClick={toggleListening}
          disabled={isListening}
          className={`w-24 h-24 rounded-full transition-all duration-300 ${
            isListening ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isListening ? <Mic className="w-12 h-12" /> : <MicOff className="w-12 h-12" />}
        </Button>

        {isListening && countdown !== null && (
          <div className="mt-4 flex items-center justify-center gap-4">
            <Button
              onClick={resetRecording}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md shadow-md"
            >
              Start Over
            </Button>

            <div className="text-lg font-mono text-gray-300 min-w-[60px] text-center">
              ⏱️ {countdown}s
            </div>

            <Button
              onClick={stopRecording}
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-md shadow-md"
            >
              Already said it
            </Button>
          </div>
        )}
        <div className="text-center mt-2">
          <p className="text-gray-300">
            {statusMessage ||
              'Tap the mic to start recording — you’ll have 8 seconds to say the phrase.'}
          </p>
        </div>
      </Card>
    </div>
  );
};
