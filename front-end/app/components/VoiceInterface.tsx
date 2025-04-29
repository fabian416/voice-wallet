'use client';

import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

export const VoiceInterface = () => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');

  const toggleListening = () => {
    setIsListening(!isListening);
    // Voice recognition logic will be implemented later
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <Card className="p-8 flex flex-col items-center gap-6 bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-xl shadow-xl w-full max-w-md">
        <div className="text-2xl font-bold mb-4">Wally AI Assistant</div>
        
        <Button
          onClick={toggleListening}
          className={`w-24 h-24 rounded-full transition-all duration-300 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isListening ? (
            <MicOff className="w-12 h-12" />
          ) : (
            <Mic className="w-12 h-12" />
          )}
        </Button>

        <div className="text-center mt-4">
          <p className="text-gray-300">
            {isListening ? 'Listening...' : 'Tap to start speaking'}
          </p>
          {lastCommand && (
            <p className="text-sm text-gray-400 mt-2">
              Last command: {lastCommand}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}; 