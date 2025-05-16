'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { clearIdentityStorage } from '@/lib/utils';

export default function CredentialPage() {
  const router = useRouter()
  const [credential, setCredential] = useState<any | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('credential')

    if (!stored || stored === 'undefined') {
      clearIdentityStorage();
      router.push('/')
      return
    }

    try {
      const parsed = JSON.parse(stored)
      setCredential(parsed)
    } catch {
      clearIdentityStorage();
      router.push('/')
    }
  }, [])

  const handleDownloadVoiceprint = () => {
    const voiceprint = localStorage.getItem("voiceprint");
    if (!voiceprint) {
      console.warn("No voiceprint found in localStorage");
      return;
    }
  
    const blob = new Blob([voiceprint], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "voiceprint.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  
    URL.revokeObjectURL(url);
  };
      

  return (
    <div className="min-h-screen pt-24 bg-gray-950 text-white flex flex-col items-center px-4">
      <h1 className="text-2xl font-bold mb-2">This is your Credential</h1>
      <p className="mb-6">Your identity is now linked to your voice.</p>

      <Button onClick={handleDownloadVoiceprint} className="mb-6">
        🔊 Download Voiceprint
      </Button>

      {credential && (
        <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-6 overflow-auto max-w-4xl w-full text-sm font-mono whitespace-pre-wrap mb-12 scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-gray-800">
            <pre>{JSON.stringify(credential, null, 2)}</pre>
        </div>
      )}
    </div>
  );

}
