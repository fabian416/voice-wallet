'use client'

import { useRef } from 'react';
import { VoiceInterface } from './components/VoiceInterface';

export default function Home() {

  return (
    <main className="min-h-[calc(100vh-3.3rem)] flex flex-col items-center justify-start bg-gradient-to-b from-gray-950 to-gray-900 text-white px-4">
      {/* Hero */}
      <div className="flex flex-col items-center text-center gap-3 pt-24">
      <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 p-4">
        Wally
      </h1>
        <p className="text-xl text-gray-300 max-w-3xl">
        Wally is an AI assistant that creates a secure <strong>voiceprint</strong> linked to your <strong>identity</strong> through <strong>DID-Linked Resources</strong> — speak once, and prove it’s really you.
        </p>
       
        <div className="w-full max-w-3xl">
          <VoiceInterface />
        </div>
      </div>
    </main>
  );
}
